#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$SCRIPT_DIR/lib/log.sh"
ROLE="${1:-}"
REQUEST="${2:-}"
if [[ "$ROLE" == -h || "$ROLE" == --help ]]; then
  printf 'Usage: bash scripts/run-agent.sh <role> "<request>"\nRoles: coordinator, researcher, general-worker, implementer, screen-implementer, reviewer, tester, validator, design-validator, archivist\n'
  exit 0
fi
if [[ -z "$ROLE" || -z "$REQUEST" ]]; then
  printf 'Usage: bash scripts/run-agent.sh <role> "<request>"\n' >&2
  exit 2
fi
case "$ROLE" in
  coordinator|researcher|general-worker|implementer|screen-implementer|reviewer|tester|validator|design-validator|archivist) ;;
  *) log ERROR 31 "Unknown agent role: $ROLE"; exit 2 ;;
esac

ROLE_FILE="$ROOT/agents/$ROLE.md"
[[ -f "$ROLE_FILE" ]] || { log ERROR 31 "Missing role instructions: $ROLE_FILE"; exit 1; }
PROMPT="$(cat "$ROLE_FILE")

--- Repository instructions ---
$(cat "$ROOT/RULES.md")

--- Request ---
$REQUEST"
PROVIDER="${NONAME_PROVIDER:-codex}"
case "$PROVIDER" in
  codex|opencode) ;;
  *) log ERROR 31 "NONAME_PROVIDER must be codex or opencode (got $PROVIDER)"; exit 2 ;;
esac

START="$(date +%s)"
log INFO 36 "Starting $ROLE with $PROVIDER${NONAME_MODEL:+ | model: $NONAME_MODEL}"
set +e
case "$PROVIDER" in
  codex) bash "$SCRIPT_DIR/adapters/codex.sh" "$ROOT" "$PROMPT" ;;
  opencode) bash "$SCRIPT_DIR/adapters/opencode.sh" "$ROOT" "$PROMPT" ;;
esac
RESULT=$?
set -e
log INFO 36 "Elapsed: $(( $(date +%s) - START ))s"
if [[ "$RESULT" -eq 0 ]]; then log OK 32 'Provider process completed'
else log ERROR 31 "Provider process failed with exit status $RESULT"; fi
exit "$RESULT"
