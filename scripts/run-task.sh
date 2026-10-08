#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/log.sh"
ROLE="${1:-}"
TEMPLATE="${2:-}"
TASK="${3:-}"
MODEL="${NONAME_MODEL:-}"
VERBOSE=0
DRY_RUN=0

if [[ "$ROLE" == -h || "$ROLE" == --help ]]; then
  printf 'Usage: bash scripts/run-task.sh <role> <prompt-file> "<task>" [--model <name>] [--verbose] [--dry-run]\n'
  exit 0
fi
if [[ -z "$ROLE" || -z "$TEMPLATE" || -z "$TASK" ]]; then
  printf 'Usage: bash scripts/run-task.sh <role> <prompt-file> "<task>" [options]\n' >&2
  exit 2
fi
[[ -f "$TEMPLATE" ]] || { log ERROR 31 "Prompt template missing: $TEMPLATE"; exit 1; }
shift 3
while [[ $# -gt 0 ]]; do
  case "$1" in
    --model) [[ $# -ge 2 && -n "$2" ]] || { log ERROR 31 '--model needs a name'; exit 2; }; MODEL="$2"; shift 2 ;;
    --verbose) VERBOSE=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h|--help) printf 'Options: --model <name> --verbose --dry-run\n'; exit 0 ;;
    *) log ERROR 31 "Unknown option: $1"; exit 2 ;;
  esac
done

REQUEST="$(printf 'Task: %s\n\n' "$TASK"; cat "$TEMPLATE")"
PROVIDER="${NONAME_PROVIDER:-codex}"
case "$PROVIDER" in codex|opencode) ;; *) log ERROR 31 "Unsupported provider: $PROVIDER"; exit 2 ;; esac
START="$(date +%s)"
log INFO 36 "Agent task: $ROLE | provider: $PROVIDER${MODEL:+ | model: $MODEL}"
if [[ "$VERBOSE" -eq 1 ]]; then printf '\n%s\n' "$REQUEST"; fi
if [[ "$DRY_RUN" -eq 1 ]]; then log WARN 33 'Dry run: provider was not started'; exit 0; fi

set +e
NONAME_MODEL="$MODEL" bash "$SCRIPT_DIR/run-agent.sh" "$ROLE" "$REQUEST"
RESULT=$?
set -e
log INFO 36 "Elapsed: $(( $(date +%s) - START ))s"
if [[ "$RESULT" -eq 0 ]]; then log OK 32 'Provider process completed; inspect its structured result'
else log ERROR 31 "Provider process failed with exit status $RESULT"; fi
exit "$RESULT"
