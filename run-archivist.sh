#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 || -z "$1" ]]; then
  printf 'Usage: bash run-archivist.sh "<successful run result path or summary>"\n' >&2
  exit 2
fi
REQUEST="""Archive durable knowledge for this completed successful run: $1

Read specs/workflow.md and specs/memory.md. Confirm the supplied run result
shows every planned stage completed successfully and includes stage results,
findings, changed paths, and checkpoint identities. If the run failed,
halted, or lacks evidence of success, make no memory changes and report why.
Follow agents/archivist.md: capture only concise, non-obvious reusable decisions,
notes, and progress; preserve repository memory policy; avoid duplication and
never modify specs, source, or tests. Report memory paths changed and outcome."""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/run-agent.sh" archivist "$REQUEST"
