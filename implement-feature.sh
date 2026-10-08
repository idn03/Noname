#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
SPECS_DIR="$PROJECT_DIR/specs"
source "$SCRIPT_DIR/scripts/lib/log.sh"
PROMPT=""
SCOPE=""
MODEL="${NONAME_MODEL:-}"
VERBOSE=0
DRY_RUN=0

usage() {
  cat <<'USAGE'
Usage: bash implement-feature.sh "<stage ID or feature request>" [options]

Options:
  --scope <spec-path>  Focus on a file or directory beneath specs/
  --model <model>      Select a provider model
  --verbose            Show run configuration and full prompt
  --dry-run            Print the request without starting a provider

Provider selection: NONAME_PROVIDER=codex (default) or opencode
USAGE
}

if [[ $# -lt 1 || -z "$1" ]]; then
  usage >&2
  exit 2
fi
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

REQUEST="$(printf 'Implement this feature as a complete workflow stage:\n%s\n\nScope instruction: %s\n\n' "$PROMPT" "$SCOPE_INSTRUCTION"; cat "$SCRIPT_DIR/scripts/prompts/implement-feature.md")"

PROVIDER="${NONAME_PROVIDER:-codex}"
case "$PROVIDER" in
  codex|opencode) ;;
  *) log ERROR 31 "NONAME_PROVIDER must be codex or opencode (got $PROVIDER)"; exit 2 ;;
esac
START_TIME="$(date +%s)"
log INFO 36 'Feature implementation'
log INFO 36 "Provider: $PROVIDER${MODEL:+ | Model: $MODEL}"
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
