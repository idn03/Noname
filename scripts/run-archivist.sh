#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ "${1:-}" == -h || "${1:-}" == --help ]]; then
  printf 'Usage: bash scripts/run-archivist.sh "<successful run result path or summary>" [--model <model>] [--verbose] [--dry-run]\n'
  exit 0
fi
if [[ $# -lt 1 || -z "$1" ]]; then
  printf 'Usage: bash scripts/run-archivist.sh "<successful run result path or summary>" [--model <model>] [--verbose] [--dry-run]\n' >&2
  exit 2
fi
TASK="$1"
shift
exec bash "$SCRIPT_DIR/run-task.sh" archivist "$SCRIPT_DIR/prompts/archive-run.md" "$TASK" "$@"
