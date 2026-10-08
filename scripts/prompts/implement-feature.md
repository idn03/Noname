Read RULES.md, specs/workflow.md, specs/contracts.md, specs/providers.md,
specs/memory.md, and specs/07-planning/backlog.md. Load relevant memory and
reuse the stable plan. Preserve backlog IDs, dependencies, scope, and order.
If planning requires human review, return the plan and stop before editing.

For the eligible stage, use agents/implementer.md or
agents/screen-implementer.md, then delegate to agents/reviewer.md,
agents/tester.md, and agents/validator.md in order. Keep the reviewer and
validator read-only; the tester may edit tests only. Execute configured checks
and use engine evidence for gates. A claim, skipped check, or unavailable check
does not pass. Track bounded repair attempts, halt on unrecoverable failure,
and preserve resumable run state. Checkpoint only after all required gates pass.
Archive only after the full plan succeeds. Serialize shared mutations.
