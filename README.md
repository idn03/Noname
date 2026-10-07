# Noname

Noname is a web-based multiplayer card game for small groups playing together
on the same local network. Version 0 focuses on a complete, host-managed game
loop with team-based card play and challenges.

This project uses spec-driven development. Product requirements, gameplay
rules, and technical decisions live under `specs/`; the workflow specifications
define how agent-assisted work is planned, checked, and resumed.

## Spec-Driven Workflow

Specifications are the source of truth for implementation:

```text
Epic → Plan → Implement → Review → Test → Validate → Checkpoint
```

An epic is divided into dependency-ordered stages. Each stage has one primary
concern, explicit completion criteria, and a stable identity for resumption.
Stages are completed only when the required quality gates produce passing
evidence and the stage is checkpointed.

Failed review, test, or validation may enter a bounded, scoped repair loop. If
repair is exhausted, a required check is unavailable, or checkpointing fails,
the run halts with its state and failure information preserved.

Independent planning or read-only checks may run in parallel. Shared
mutations remain serialized unless they have explicit isolation.

## Quality model

The orchestrator decides completion from structured results and executed engine
checks. An agent’s claim that work is complete is not a quality gate.

Every run should make these facts inspectable:

- what was planned and why stages are ordered;
- which agent performed each bounded concern;
- what changed and what checks actually ran;
- which repairs were attempted and why they stopped;
- which stages were completed, skipped, or left unattempted;
- where execution halted and whether it can resume.

## Provider boundary

The core workflow does not depend on a particular coding-agent product.
Provider adapters translate a shared agent request into provider execution and
map the result back to the shared contract.

Codex and OpenCode belong at this boundary. Authentication, model selection,
command-line flags, process handling, and provider-specific output stay inside
their adapters. The same workflow and stage contracts should remain usable by
either provider.

## Repository map

- [`specs/00-context/`](specs/00-context/) — product overview, terminology, and
  constraints.
- [`specs/01-product/`](specs/01-product/) — product requirements, rules, and
  user stories.
- [`specs/02-ux/`](specs/02-ux/) — user flows, navigation, screens, and design.
- [`specs/03-technical/`](specs/03-technical/) and
  [`specs/04-backend/`](specs/04-backend/) — technical and backend contracts.
- [`specs/05-features/`](specs/05-features/) — feature-level requirements and
  acceptance criteria.
- [`specs/06-testing/`](specs/06-testing/) — project testing strategy.
- [`specs/07-planning/`](specs/07-planning/) and
  [`specs/08-decisions/`](specs/08-decisions/) — planning and architecture
  decisions.
- [`specs/workflow.md`](specs/workflow.md) — lifecycle, ordering, recovery, and
  parallelism.
- [`specs/contracts.md`](specs/contracts.md) — plan, agent, gate, stage, and run
  result contracts.
- [`specs/providers.md`](specs/providers.md) — provider adapter boundary and
  obligations.
- [`specs/memory.md`](specs/memory.md) — cross-run knowledge capture and
  memory precedence.
- [`agents/`](agents/) — focused responsibilities used during a run.
- [`RULES.md`](RULES.md) — repository and workflow invariants.
- [`AGENTS.md`](AGENTS.md) — instructions for agents working in this repository.

The specifications are concise, human-managed, and authoritative. Runtime
behavior must not introduce workflow semantics that are absent from `specs/`
without updating the relevant contract first.

## When to use it

This model is most useful when implementing the wrong behavior costs more than
additional planning and validation: large features, cross-cutting changes,
migrations, or work that must be resumed and audited.

For small or obvious changes, a direct coding-agent loop may be more efficient.
The right stage boundaries, roles, checks, retry limits, and checkpoint policy
remain project-specific.

## Design goals

- small core;
- explicit, serializable contracts;
- deterministic orchestration;
- dependency-aware execution;
- bounded recovery;
- engine-derived quality gates;
- resumable checkpoints;
- portable provider integrations.
