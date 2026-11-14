# Workflow definition

## Purpose

The harness turns one epic into dependency-ordered, single-concern stages and
executes each stage through a deterministic quality pipeline.

## Lifecycle

`create branch → plan → implement → review → test → validate → commit → push branch → archive`

Implementation through commit repeats for every stage. Checkpointing completes
a stage; branch push happens after the run's completed-stage commits are ready.
Archival runs once after the run when all planned stages complete. A run may
resume from completed checkpoints.

## Repository task lifecycle

- After repository safety checks, create or resume one task branch from the
  current base branch before planning or changing files. Keep the task branch
  across all stages and repairs in the run.
- Execute stages in plan order. Run required checks locally and record their
  commands and outcomes before creating each completion checkpoint commit.
- Commit only task changes after their required local checks pass. Keep
  unrelated pre-existing work out of task commits.
- If a stage halts at the repair limit, create a separately identified recovery
  commit after recording the attempted local checks and their outcomes. Never
  label it a completion commit.
- Push the task branch after the run's completed-stage commits are ready, or
  after a halted run has a resumable recovery commit. Record the push result;
  a failed push halts delivery and leaves the branch available for retry.
- Do not commit or push directly to the base branch as part of task execution.
- Resumption reuses the original task branch and plan. It does not create a
  replacement branch or rewrite existing stage commits.

## Planning

- The epic is decomposed before implementation begins.
- Every stage has one primary concern, explicit dependencies, and completion
  criteria.
- Stages are ordered so dependencies complete before dependents.
- Decimal stage IDs add focused sub-stages without renumbering existing stages.
  Include them in a reviewed plan's dependency order; do not insert them
  retroactively into an in-progress run.
- Planning output is reviewable and can be supplied unchanged to a later run.

## Stage execution

- Implementation operates only within the current stage scope.
- Review checks implementation against the stage and repository rules.
- Test checks behavior required by the stage.
- Validation runs the repository’s configured quality checks.
- Each phase produces a structured result.

## Browser readiness

- Before the Coordinator starts a feature workflow, the runner checks that the
  application responds on loopback and that the Playwright Test browser
  preflight passes against that application.
- The runner reuses a healthy loopback server or starts one for the workflow,
  then stops only the server it started when the workflow exits.
- The runner passes the ready application URL and preflight status to the
  Coordinator. The Coordinator reuses that endpoint and never starts a second
  application server during the same feature run.
- A failed browser preflight halts before Cycle 1, records the failed setup
  command and outcome, and consumes no implementation/review cycle. Resume the
  same stage after the environment is repaired.
- For browser stages, the Coordinator uses the prepared server for the required
  Playwright Test UI review. Record test output, viewport screenshots, trace
  artifacts, console and request evidence, and relevant interactions. The review and required
  browser-flow tests use the same Playwright Test toolchain; coverage required
  by each feature test spec remains a test gate.

## Memory context

- Before planning and delegation, the coordinator loads relevant memory as
  defined by `memory.md`.
- Memory is advisory context and never substitutes for specifications or gate
  evidence.
- The archivist receives the completed run result, stage results, findings,
  changed paths, and relevant existing memory.

## Repair

- A stage has at most three implementation/review cycles. Cycle 1 includes
  initial implementation; later cycles repair issues found in earlier cycles.
- Every cycle reviews all changed and impacted frontend and backend behavior
  in scope, runs focused behavior checks, and reviews browser UI when the stage
  has a user-facing interface.
- Before implementing a `web-game` interface, the screen implementer follows
  the project design system, existing UI patterns, and product, accessibility,
  and gameplay-clarity requirements.
- UI review uses Playwright Test evidence: test output, screenshots at relevant
  viewport sizes, trace artifacts, console and request evidence, and a relevant
  interaction.
  A required but unavailable browser check is not a pass. Record why UI review
  is not applicable for stages without a browser interface.
- Failed review, focused tests, or validation findings are sent to the
  responsible implementer and consume the next cycle. Record cycle number,
  findings, repairs, commands, outcomes, and evidence paths.
- If Cycle 3 does not pass all required gates, create a temporary recovery
  checkpoint and halt the stage. Update the run/task record with blocked status,
  failed gates, remaining acceptance criteria, findings, and the next resume
  action. Keep the stage incomplete and do not start dependent stages.
- A temporary recovery checkpoint preserves work for resumption; it is not a
  completion checkpoint, does not satisfy dependencies, and cannot mark the
  stage completed. Completion checkpointing still requires every gate to pass.

## Quality gates

- Gate outcomes come from executed engine checks, not agent claims.
- A stage passes only when implementation, review, test, and validation pass.
- A skipped or unavailable required check is not a pass.

## Checkpoints and halting

- A passing stage is checkpointed with a stage-identifying commit, created only
  after its required local gates pass.
- A failed stage at the cycle limit receives a separately identified temporary
  recovery commit. It preserves the worktree and task state but never counts
  as a completed-stage checkpoint.
- Checkpoint failure halts the run.
- A failed stage halts the run; later stages are not attempted.
- The result records the halt stage, cause, and recoverable state.

## Archival

- Archival runs only after every planned stage is completed successfully.
- It records concise decisions, notes, and progress according to `memory.md`.
- It is not a stage quality gate and cannot make an incomplete run complete.
- An archival failure is retained in the run result while completed stage and
  run status remain accurate.

## Resumption

- Resumption uses the original plan and checkpoint identity.
- Completed stages are skipped only when their completion checkpoint is present.
- A temporary recovery checkpoint resumes the same incomplete stage and cycle
  history; it never permits dependent stages to run.
- The first incomplete stage is re-entered.
- Resumption must not silently renumber or reorder stages.

## Parallelism

- Independent planning or read-only checks may run in parallel.
- Mutating stage work is serialized unless isolation is explicit.
- A dependent stage cannot start before all dependencies pass.
