# Noname Development Rules

These human-maintained rules apply to all implementation work in this
repository.

## Engineering

1. Use TypeScript by default.
2. Choose clear, meaningful names and explicit types where they improve safety.
3. Keep files below 120 lines; split cohesive responsibilities when they grow.
4. Prefer small, composable functions and simple, maintainable designs.
5. Favor immutable data and return new instances when practical.
6. Separate pure logic, data structures, and side effects.
7. Maximize testability through pure logic and dependency injection.
8. Prefer built-in or proven dependencies over custom infrastructure.
9. Use named exports and kebab-case paths; avoid unnecessary barrel files.
10. Apply YAGNI: keep the core small and avoid speculative abstractions.
11. Log errors in catch paths; never silently swallow failures.
12. Investigate unclear failures with temporary diagnostic logging, then remove
    noise that is not part of the intended behavior.
13. Do not uncritically accept requirements or agent claims; verify evidence.

## Workflow

14. Treat `specs/` as the source of truth and update it when behavior changes.
15. Keep specifications concise, human-managed, and free of implementation code.
16. Keep the core workflow provider-agnostic.
17. Keep Codex, OpenCode, and future provider behavior inside adapters.
18. Plan before mutating the repository.
19. Execute stages in dependency order and keep each stage single-concern.
20. Require implementation, review, test, and validation before checkpointing.
21. Use engine-derived evidence for quality gates; claims are not evidence.
22. Keep repair loops bounded and record every iteration and outcome.
23. Checkpoint only completed stages.
24. Halt on unrecoverable failure and preserve resumable state.
25. Serialize shared mutations; parallelize only isolated or read-only work.
26. Never treat missing, skipped, or unavailable checks as passing.
27. Keep contracts structured, serializable, deterministic, and provider-neutral.
28. Pass all relevant context when delegating work to another agent or adapter.

## Repository hygiene

29. Create a git checkpoint when a requested implementation is complete.
30. Keep temporary investigation or run documents in `docs/temps/`, using a UTC
    timestamp prefix, and report their paths.
31. Do not modify generated files or dependency lockfiles without a reason tied
    to the requested change.
32. Keep documentation minimal and limited to behavior needed to use or
    maintain the harness.
