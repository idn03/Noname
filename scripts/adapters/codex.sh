#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-}"
PROMPT="${2:-}"
if [[ -z "$ROOT" || -z "$PROMPT" ]]; then
  printf 'Usage: bash scripts/adapters/codex.sh <repository> "<prompt>"\n' >&2
  exit 2
fi
command -v codex >/dev/null || { printf 'codex CLI is unavailable\n' >&2; exit 127; }
if [[ -n "${NONAME_MODEL:-}" ]]; then
  exec codex exec --model "$NONAME_MODEL" -C "$ROOT" "$PROMPT"
fi
exec codex exec -C "$ROOT" "$PROMPT"
