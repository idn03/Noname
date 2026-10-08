# Backlog workflow runbook

Use these run sheets with the workflow runner or agent provider configured for
this repository. They define prompts and operator checks; they are not shell
scripts. The workflow contract is [specs/workflow.md](../../../specs/workflow.md)
and the stage source is [specs/07-planning/backlog.md](../../../specs/07-planning/backlog.md).

## Run order

1. **Epic:** provide the product epic and relevant context to the runner.
2. **Plan:** create and review the complete dependency-ordered plan before edits.
3. **Execute each stage:** use its run sheet below, in backlog order. Finish all
   gates and checkpoint before starting a dependent stage.
4. **Resume:** supply the original plan and checkpoint/run state. Do not
   renumber, reorder, or repeat completed stages without evidence.

## Operator prompt — Epic and Plan

> Read `RULES.md`, `specs/workflow.md`, `specs/memory.md`, and
> `specs/07-planning/backlog.md`. Treat the provided epic as the requested
> outcome. Map it to applicable backlog stages, identify any missing stage
> needed to fulfill the epic, and produce a stable plan with stage IDs, scope,
> dependencies, completion criteria, relevant specs, and expected checks.
> Preserve backlog dependency order. Do not edit source or tests during
> planning. Return the plan for human review and record unresolved assumptions.

## Stage documents

- [B-001 — Application Foundation](b-001-application-foundation.md)
- [B-002 — Game Engine Foundation](b-002-game-engine-foundation.md)
- [B-003 — Static Game Content](b-003-static-game-content.md)
- [B-004 — Player Identity and Lobby](b-004-player-identity-and-lobby.md)
- [B-005 — Host Controls and Team Assignment](b-005-host-controls-and-team-assignment.md)
- [B-006 — Personal Card Selection](b-006-personal-card-selection.md)
- [B-007 — Attack, Defense, and Challenges](b-007-attack-defense-and-challenges.md)
- [B-008 — Scoring and Results](b-008-scoring-and-results.md)
- [B-009 — Realtime Reliability and Privacy](b-009-realtime-reliability-and-privacy.md)
- [B-010 — Browser Acceptance](b-010-browser-acceptance.md)

## Gate checklist for every stage

- [ ] Dependencies have passing checkpoints and the plan is unchanged.
- [ ] Implement only the stage scope; report changed paths and checks.
- [ ] Review is read-only and reports structured findings with evidence.
- [ ] Tests cover the stage behavior; missing or unavailable checks fail the gate.
- [ ] Validation executes configured quality checks and records outcomes.
- [ ] Repair is bounded per stage and failure class; record each attempt.
- [ ] Checkpoint only after implementation, review, test, and validation pass.
- [ ] On failure, halt later stages and preserve cause plus resumable state.
- [ ] After all planned stages pass, archive concise reusable knowledge.

