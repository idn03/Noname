# Workflow contracts

## Plan

A plan contains an epic identity, ordered stages, and the plan version.

Each stage contains a stable identity, human title, single concern, scope,
dependency identities, completion criteria, and checkpoint identity.

Stage identities remain stable across resumption.

## Agent request

A request identifies the run, stage, role, repository location, relevant
specification scope, prior results, and allowed objective. It may include the
current repair iteration and its limit, plus relevant memory context and the
memory policy governing its use.

An agent receives only the context required for its role and must return a
structured result.

## Agent result

A result contains status, summary, changed paths, executed checks, findings,
and a machine-readable failure reason when unsuccessful.

Status is success, failure, or unavailable. Success requires evidence
appropriate to the assigned role.

## Gate result

A gate result contains gate identity, status, command or engine source,
observed outcome, and duration.

Gate status is pass, fail, or unavailable. Only pass satisfies a required gate.

## Stage result

A stage result contains stage identity, ordered implementation/review cycles,
phase results, checkpoint result, and final status. Each cycle records its
number (1–3), implementation result, frontend/backend scope review, browser UI
evidence or a not-applicable reason, focused behavior checks, findings, and
repair outcome.

Final status is completed, failed, halted, or skipped. A completed stage has
passing required gates and a successful completion checkpoint. If the third
cycle fails, the stage result records a temporary recovery checkpoint, blocked
task status, failed gates, remaining acceptance criteria, findings, and next
resume action. This checkpoint preserves work but does not complete the stage
or satisfy dependencies.

## Run result

A run result contains run identity, plan identity, stage results, counts,
resumption information, halt information, and archival result.

The result distinguishes attempted, completed, skipped, and unattempted
stages. Halt information is present whenever execution does not reach the end
of the plan.

## Archival result

An archival result contains status, memory classes considered, changed memory
paths, and a failure reason when capture is unsuccessful. Status is success,
failure, or unavailable. It is present for a completed run and records the
outcome without changing stage or run completion status.

## Contract invariants

- Results are serializable and deterministic for the same observed run.
- Missing required fields are contract failures.
- Provider-specific fields do not appear in core workflow contracts.
- A result cannot claim a passing gate without engine evidence.
