#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 || -z "$1" ]]; then
  printf 'Usage: bash fix-bug.sh "<bug description and reproduction>"\n' >&2
  exit 2
fi
REQUEST="""Investigate and fix this bug as a scoped workflow run: $1

Read RULES.md and relevant specs before changing files. Delegate initial
read-only diagnosis to agents/researcher.md. Identify the owning feature/stage
and dependencies; do not guess where specifications are unclear. Then have the
coordinator assign the minimal fix to implementer or screen-implementer, run
reviewer, tester, and validator as separate roles, and collect structured
results. The tester may edit tests only; reviewer and validator must remain
read-only. Execute relevant checks and treat unavailable evidence as a failed
gate. Bound and record repair attempts. Checkpoint the bug fix only after all
required gates pass; otherwise halt with the cause and resumable state. Do not
archive unless the complete planned run succeeded."""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/run-agent.sh" coordinator "$REQUEST"
