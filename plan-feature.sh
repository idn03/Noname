#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 || -z "$1" ]]; then
  printf 'Usage: bash plan-feature.sh "<epic or feature request>"\n' >&2
  exit 2
fi
REQUEST="""Plan this epic before any implementation: $1

Read RULES.md, specs/workflow.md, specs/contracts.md, specs/memory.md, and
specs/07-planning/backlog.md. Ask agents/researcher.md for relevant read-only
repository/spec investigation as needed. Return a stable, dependency-ordered
plan with stage IDs, titles, single-concern scope, dependencies, completion
criteria, relevant specifications, and expected checks. Reuse backlog IDs for
matching stages; do not renumber or reorder them. Identify assumptions and
present the plan for human review. Do not edit source, tests, or specifications
and do not begin implementation."""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/run-agent.sh" coordinator "$REQUEST"
