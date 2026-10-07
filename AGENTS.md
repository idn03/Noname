# Agent instructions

You are working in the Noname project repository.

Read and follow [RULES.md](RULES.md) before changing files. Use the documents
under `specs/` as the authoritative workflow and contract definitions. Keep
specifications human-managed and concise; do not place source code, pseudo-code,
or examples in them.

Agent responsibilities are defined in:

- [agents/coordinator.md](agents/coordinator.md) for run orchestration.
- [agents/researcher.md](agents/researcher.md) for read-only investigation.
- [agents/general-worker.md](agents/general-worker.md) for isolated small tasks.
- [agents/implementer.md](agents/implementer.md) for source implementation.
- [agents/screen-implementer.md](agents/screen-implementer.md) for interface work.
- [agents/reviewer.md](agents/reviewer.md) for read-only review.
- [agents/tester.md](agents/tester.md) for test creation and execution.
- [agents/validator.md](agents/validator.md) for final quality gates.
- [agents/design-validator.md](agents/design-validator.md) for optional design checks.
- [agents/archivist.md](agents/archivist.md) for post-run knowledge capture.

Provider adapters are integration components, not workflow roles. They must
follow [specs/providers.md](specs/providers.md).

Before implementation, identify the relevant specification and its invariants.
Keep changes within the requested stage or concern. Preserve provider
independence in the core and put Codex or OpenCode behavior behind adapters.

Every workflow change must preserve deterministic ordering, bounded repair,
engine-derived gates, checkpointing, halting, and resumption. Update the
specification when behavior or a shared contract changes.
