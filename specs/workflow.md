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

- A failed review, test, or validation opens a bounded repair loop.
- Each loop receives failure results and may change only relevant work.
- The configured limit applies per stage and per failure class.
- Exhausting a limit fails the stage.

## Quality gates

- Gate outcomes come from executed engine checks, not agent claims.
- A stage passes only when implementation, review, test, and validation pass.
- A skipped or unavailable required check is not a pass.

## Checkpoints and halting

- A passing stage is checkpointed with a stage-identifying commit.
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
- Completed stages are skipped only when their checkpoint is present.
- The first incomplete stage is re-entered.
- Resumption must not silently renumber or reorder stages.

## Parallelism

- Independent planning or read-only checks may run in parallel.
- Mutating stage work is serialized unless isolation is explicit.
- A dependent stage cannot start before all dependencies pass.
