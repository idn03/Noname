#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 || -z "$1" ]]; then
  printf 'Usage: bash implement-feature.sh "<stage ID or feature request>"\n' >&2
  exit 2
fi
REQUEST="""Implement the requested feature as one complete workflow stage: $1

Read specs/workflow.md, specs/contracts.md, specs/providers.md, and
specs/07-planning/backlog.md. First load relevant memory and form or reuse the
stable dependency-ordered plan. If the request matches a backlog stage, preserve
its ID, scope, dependencies, and completion criteria. If the plan needs human
approval, stop before edits and return the reviewable plan.

For the approved eligible stage, delegate implementation to the smallest
suitable role from agents/ (implementer or screen-implementer), then run the
read-only reviewer, tester, and read-only validator roles in dependency order.
Use the coordinator contract for structured handoffs and results. The tester
may change tests only; reviewer and validator are read-only. Run configured
checks and use their executed results as gate evidence; agent claims alone do
not pass. Apply bounded, recorded repairs, halt on unavailable/failed gates,
and do not start dependent stages early. Create a stage-identifying git
checkpoint only after implementation, review, test, and validation pass.
Preserve a resumable run result and archive memory only after the whole planned
run completes successfully. Do not execute multiple mutating stages in
parallel."""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/run-agent.sh" coordinator "$REQUEST"
