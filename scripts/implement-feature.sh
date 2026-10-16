#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SPECS_DIR="$PROJECT_DIR/specs"
source "$SCRIPT_DIR/lib/log.sh"
PROMPT=""
SCOPE=""
MODEL="${NONAME_MODEL:-}"
VERBOSE=0
DRY_RUN=0
MAX_CYCLES=3

usage() {
  cat <<'USAGE'
Usage: bash scripts/implement-feature.sh "<stage ID or feature request>" [options]

Options:
  --scope <spec-path>  Focus on a file or directory beneath specs/
  --model <model>      Select a provider model
  --verbose            Show run configuration and full prompt
  --dry-run            Print the request without starting a provider
                       (implementation/review loop is limited to 3 cycles)

Provider selection: NONAME_PROVIDER=codex (default) or opencode
USAGE
}

if [[ $# -lt 1 || -z "$1" ]]; then
  usage >&2
  exit 2
fi
if [[ "$1" == -h || "$1" == --help ]]; then usage; exit 0; fi
PROMPT="$1"
shift
while [[ $# -gt 0 ]]; do
  case "$1" in
    --scope)
      [[ $# -ge 2 && -n "$2" ]] || { log ERROR 31 '--scope needs a path'; exit 2; }
      SCOPE="$2"
      shift 2
      ;;
    --model)
      [[ $# -ge 2 && -n "$2" ]] || { log ERROR 31 '--model needs a name'; exit 2; }
      MODEL="$2"
      shift 2
      ;;
    --verbose) VERBOSE=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) log ERROR 31 "Unknown option: $1"; usage >&2; exit 2 ;;
  esac
done

[[ -d "$SPECS_DIR" ]] || { log ERROR 31 'specs/ not found'; exit 1; }
log OK 32 'Specs found'

SCOPE_INSTRUCTION='Read the relevant product, feature, UX, backend, and technical specifications for this request.'
if [[ -n "$SCOPE" ]]; then
  case "$SCOPE" in
    /*|..|../*|*/..|*/../*) log ERROR 31 'Scope must remain beneath specs/'; exit 2 ;;
  esac
  SCOPE_PATH="$SPECS_DIR/$SCOPE"
  [[ -f "$SCOPE_PATH" || -d "$SCOPE_PATH" ]] || {
    log ERROR 31 "Scope not found: specs/$SCOPE"
    exit 1
  }
  if [[ -f "$SCOPE_PATH" ]]; then
    [[ "$SCOPE_PATH" == *.md ]] || { log ERROR 31 'Scope file must be Markdown'; exit 1; }
    SPEC_COUNT=1
  else
    SPEC_COUNT="$(find "$SCOPE_PATH" -type f -name '*.md' | wc -l | tr -d ' ')"
    [[ "$SPEC_COUNT" -gt 0 ]] || { log ERROR 31 "No Markdown specs in specs/$SCOPE"; exit 1; }
  fi
  SCOPE_INSTRUCTION="Focus on specs/$SCOPE and read any other specifications required by RULES.md, workflow.md, contracts.md, and the selected backlog stage. This scope does not replace those contracts."
  log OK 32 "Scope: specs/$SCOPE ($SPEC_COUNT Markdown document(s))"
fi

REQUEST="$(printf 'Implement this feature as a complete workflow stage:\n%s\n\nScope instruction: %s\nMaximum implementation/review cycles: %s (Cycle 1 includes the initial implementation).\n\n' "$PROMPT" "$SCOPE_INSTRUCTION" "$MAX_CYCLES"; cat "$SCRIPT_DIR/prompts/implement-feature.md")"

PROVIDER="${NONAME_PROVIDER:-codex}"
case "$PROVIDER" in
  codex|opencode) ;;
  *) log ERROR 31 "NONAME_PROVIDER must be codex or opencode (got $PROVIDER)"; exit 2 ;;
esac
START_TIME="$(date +%s)"
log INFO 36 'Feature implementation'
log INFO 36 "Provider: $PROVIDER${MODEL:+ | Model: $MODEL}"
log INFO 36 "Maximum implementation/review cycles: $MAX_CYCLES"
if [[ "$VERBOSE" -eq 1 ]]; then
  printf '\nPrompt:\n%s\n' "$REQUEST"
else
  printf 'Request: %.120s' "$PROMPT"
  [[ ${#PROMPT} -le 120 ]] || printf '...'
  printf '\n'
fi

if [[ "$DRY_RUN" -eq 1 ]]; then
  log WARN 33 'Dry run: provider was not started'
  exit 0
fi

# Keep the app available to the Coordinator and Playwright CLI for the full
# workflow. Reuse an already healthy server; otherwise own its lifecycle here.
command -v curl >/dev/null || { log ERROR 31 'curl is required for the browser readiness check'; exit 1; }
SERVER_PID=""
SERVER_STARTED_BY_RUNNER=0
SERVER_LOG="${TMPDIR:-/tmp}/noname-feature-server-$$.log"
PLAYWRIGHT_DIR="${TMPDIR:-/tmp}/noname-playwright-daemon-$$"
BROWSER_LOG="${TMPDIR:-/tmp}/noname-playwright-preflight-$$.log"
cleanup() {
  if [[ -n "$SERVER_PID" ]]; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
    rm -f "$SERVER_LOG"
  fi
  rm -rf "$PLAYWRIGHT_DIR"
  rm -f "$BROWSER_LOG"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

if ! curl --silent --show-error --fail --max-time 2 http://127.0.0.1:3000/ >/dev/null 2>&1; then
  log INFO 36 'Starting the feature server on 127.0.0.1:3000'
  (cd "$PROJECT_DIR" && HOST=127.0.0.1 PORT=3000 npm run dev) >"$SERVER_LOG" 2>&1 &
  SERVER_PID=$!
  SERVER_STARTED_BY_RUNNER=1
  READY=0
  for _ in $(seq 1 120); do
    if curl --silent --fail --max-time 2 http://127.0.0.1:3000/ >/dev/null 2>&1; then
      READY=1
      break
    fi
    if ! kill -0 "$SERVER_PID" 2>/dev/null; then break; fi
    sleep 1
  done
  if [[ "$READY" -ne 1 ]]; then
    log ERROR 31 'Feature server did not become ready on 127.0.0.1:3000'
    cat "$SERVER_LOG" >&2
    exit 1
  fi
fi

if ! command -v npx >/dev/null; then
  log ERROR 31 'npx is unavailable; install Node.js and project dependencies before starting this workflow'
  exit 1
fi
if ! npx --no-install playwright-cli --version >"$BROWSER_LOG" 2>&1; then
  log ERROR 31 'Playwright CLI is unavailable; install project dependencies before starting this workflow'
  cat "$BROWSER_LOG" >&2
  exit 1
fi

# Use a writable temporary daemon directory so CLI preflight does not depend
# on permissions in the user's home cache. Keep the same setting for the run.
PWTEST_DAEMON_SESSION_DIR="$PLAYWRIGHT_DIR"
export PWTEST_DAEMON_SESSION_DIR
mkdir -p "$PWTEST_DAEMON_SESSION_DIR"
if ! npx --no-install playwright-cli -s=noname-preflight open about:blank >"$BROWSER_LOG" 2>&1; then
  log ERROR 31 'Playwright CLI could not launch Chrome; run npx playwright install chrome and retry'
  cat "$BROWSER_LOG" >&2
  exit 1
fi
npx --no-install playwright-cli -s=noname-preflight close >/dev/null 2>&1 || true
log OK 32 'Loopback server and Playwright CLI browser preflight passed'

if ! curl --silent --show-error --fail --max-time 2 http://127.0.0.1:3000/ >/dev/null 2>&1; then
  log ERROR 31 'The prepared feature server stopped before the Coordinator started'
  exit 1
fi
export NONAME_BROWSER_PREFLIGHT=passed
export NONAME_APP_URL=http://127.0.0.1:3000
export NONAME_SERVER_STARTED_BY_RUNNER

set +e
NONAME_MODEL="$MODEL" bash "$SCRIPT_DIR/run-agent.sh" coordinator "$REQUEST"
EXIT_CODE=$?
set -e

printf '\nSummary\n'
log INFO 36 "Elapsed: $(( $(date +%s) - START_TIME ))s"
printf 'Git worktree status (may include pre-existing changes):\n'
git -C "$PROJECT_DIR" status --short --untracked-files=all 2>/dev/null || printf '  (git status unavailable)\n'
if [[ "$EXIT_CODE" -eq 0 ]]; then
  log OK 32 'Coordinator finished; check its structured gate results before treating the stage as complete'
else
  log ERROR 31 "Coordinator failed with exit status $EXIT_CODE"
fi
exit "$EXIT_CODE"
