# Workflow definition

## Purpose

The harness turns one epic into dependency-ordered, single-concern stages and
executes each stage through a deterministic quality pipeline.

## Lifecycle

`plan → implement → review → test → validate → checkpoint → archive`

The first six phases repeat for every stage. Checkpointing completes a stage;
archival runs once after the run when all planned stages complete. A run may
resume from completed checkpoints.

## Planning

- The epic is decomposed before implementation begins.
- Every stage has one primary concern, explicit dependencies, and completion
  criteria.
- Stages are ordered so dependencies complete before dependents.
- Planning output is reviewable and can be supplied unchanged to a later run.

## Stage execution

- Implementation operates only within the current stage scope.
- Review checks implementation against the stage and repository rules.
- Test checks behavior required by the stage.
- Validation runs the repository’s configured quality checks.
- Each phase produces a structured result.

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
- Before implementing a `web-game` interface, the screen implementer reads the
  installed `design-taste-frontend` skill and records a Design Read and chosen
  design dials. Apply suitable anti-default guidance without forcing
  marketing-page patterns onto gameplay UI or overriding product, accessibility,
  or gameplay-clarity requirements. Review that design reasoning with the UI.
- UI review uses Playwright CLI evidence: snapshot, screenshot at relevant
  viewport sizes, console and request failures, and a relevant interaction.
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

- A passing stage is checkpointed with a stage-identifying commit.
- A failed stage at the cycle limit receives a separately identified temporary
  recovery checkpoint. It preserves the worktree and task state but never
  counts as a completed-stage checkpoint.
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
