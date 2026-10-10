Read RULES.md, specs/workflow.md, specs/contracts.md, specs/providers.md,
specs/memory.md, and specs/07-planning/backlog.md. Load relevant memory and
reuse the stable plan. Preserve backlog IDs, dependencies, scope, and order.
If planning requires human review, return the plan and stop before editing.

For each eligible stage, run at most three numbered implementation/review
cycles. Cycle 1 includes the initial implementation; Cycles 2 and 3 are repairs
informed by prior findings. In each cycle, delegate implementation to
agents/implementer.md or agents/screen-implementer.md, then run the independent
scope review and focused behavior checks. The review covers all changed and
impacted frontend and backend logic against the stage scope, plus user-facing
UI with the local `npx playwright-cli` when the stage has a browser interface.
Inspect a page snapshot, a screenshot at relevant viewport sizes, browser
console errors, failed requests, and a relevant user interaction. Record the
commands, outcomes, findings, and artifact paths in the run record. A UI check
that is required but unavailable is not a pass. For non-UI stages, record why
the browser review does not apply.

When implementing a `web-game` interface, the screen implementer must read and
apply the installed `design-taste-frontend` skill as scoped in
agents/screen-implementer.md before editing. Record a Design Read and the
selected design dials. Apply its anti-default guidance where suitable, without
forcing marketing-page patterns onto gameplay UI or overriding product,
accessibility, and gameplay-clarity requirements. The reviewer checks this
rationale as part of the UI review.

The tester checks relevant frontend and backend behavior for each cycle and
may edit test files only. The reviewer and validator are read-only. If review,
focused tests, or validation finds an issue, send the evidence to the
responsible implementer and use the next cycle. After a cycle passes its scope
review and focused checks, run the configured full validation gates. A failure
there also consumes the next cycle. If Cycle 3 still fails, create a temporary
recovery checkpoint for the current worktree, mark the stage task blocked, and
update its run/task record with failed gates, remaining acceptance criteria,
findings, and the next resume action. Keep the stage incomplete and do not
start dependent stages. This temporary checkpoint is not a completion
checkpoint and cannot satisfy a dependency. Never treat a claim, skipped check,
or unavailable check as a pass. A completion checkpoint is created only after
implementation, review, tests, and validation pass. Archive only after the
full plan succeeds. Serialize shared mutations.
