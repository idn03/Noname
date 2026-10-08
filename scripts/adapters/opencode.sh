#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-}"
PROMPT="${2:-}"
if [[ -z "$ROOT" || -z "$PROMPT" ]]; then
  printf 'Usage: bash scripts/adapters/opencode.sh <repository> "<prompt>"\n' >&2
  exit 2
fi
command -v opencode >/dev/null || { printf 'opencode CLI is unavailable\n' >&2; exit 127; }
if [[ -n "${NONAME_MODEL:-}" ]]; then
  exec opencode run --model "$NONAME_MODEL" --dir "$ROOT" "$PROMPT"
fi
exec opencode run --dir "$ROOT" "$PROMPT"
