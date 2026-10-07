# Agent memory

## Purpose

Agent memory preserves concise, durable implementation knowledge across runs.
It informs future work without replacing the authoritative specifications.

## Memory classes

- **Decision** — an implementation-level choice and its rationale.
- **Note** — a reusable gotcha, constraint, or repository landmark.
- **Progress** — a concise summary of completed work and remaining scope.
- **Policy** — human-managed rules governing memory locations and writes.

Memory is repository-scoped and serializable. Storage locations and formats are
project configuration, but the shared workflow recognizes these classes.

## Precedence

Specifications are authoritative for behavior and contracts. Active decisions
are derived precedent and must yield to conflicting specifications. Notes and
progress are informational and never resolve specification conflicts.
Superseded decisions remain traceable and must identify their replacement.

## Read lifecycle

- The coordinator loads relevant active decisions, notes, progress, and policy
  before planning and delegation.
- Each agent receives only memory relevant to its role and stage scope.
- Memory is context, not evidence for implementation, review, testing, or
  validation gates.
- Missing or unavailable memory must not block a run or be treated as evidence.

## Write lifecycle

- Memory is captured only after a successful run; failed runs retain their
  reports and resumable state as the authoritative diagnostic record.
- The archivist records only non-obvious, reusable knowledge observed in the
  run, with references to the run and affected paths where applicable.
- The archivist does not modify specifications, source, tests, or human-managed
  policy memory.
- Duplicate or stale entries are avoided; a replacement decision supersedes
  the prior entry rather than silently editing its history.

## Invariants

- Memory writes are bounded, deterministic, and serialized with other shared
  mutations.
- Archival is post-run knowledge capture, not a required quality gate.
- An archival failure is recorded as unavailable or failed memory capture and
  does not convert a completed run into a failed implementation run.
