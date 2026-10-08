#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROLE="${1:-}"
REQUEST="${2:-}"

if [[ -z "$ROLE" || -z "$REQUEST" ]]; then
  printf 'Usage: bash run-agent.sh <role> "<request>"\n' >&2
  exit 2
fi
case "$ROLE" in
  coordinator|researcher|general-worker|implementer|screen-implementer|reviewer|tester|validator|design-validator|archivist) ;;
  *) printf 'Unknown agent role: %s\n' "$ROLE" >&2; exit 2 ;;
esac

ROLE_FILE="$ROOT/agents/$ROLE.md"
if [[ ! -f "$ROLE_FILE" ]]; then
  printf 'Missing role instructions: %s\n' "$ROLE_FILE" >&2
  exit 1
fi
PROMPT="$(cat "$ROLE_FILE")

--- Repository instructions ---
$(cat "$ROOT/RULES.md")

--- Request ---
$REQUEST"
PROVIDER="${NONAME_PROVIDER:-codex}"

case "$PROVIDER" in
  codex)
    exec bash "$ROOT/scripts/adapters/codex.sh" "$ROOT" "$PROMPT"
    ;;
  opencode)
    exec bash "$ROOT/scripts/adapters/opencode.sh" "$ROOT" "$PROMPT"
    ;;
  *) printf 'NONAME_PROVIDER must be codex or opencode (got %s)\n' "$PROVIDER" >&2; exit 2 ;;
esac
