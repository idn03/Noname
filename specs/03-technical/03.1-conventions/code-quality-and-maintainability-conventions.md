# Code Quality and Maintainability Conventions

## Imports and Dependencies

Prefer project aliases over long relative import chains.

Avoid circular dependencies.

Feature-specific code must not be imported into unrelated features.

Shared modules should contain only genuinely reusable functionality.

Do not add a dependency when a small and well-tested implementation is sufficient.

## Comments

Code should be self-explanatory through naming and structure.

Use comments to explain:

- Non-obvious decisions.
- Game-rule reasoning.
- Technical constraints.
- Workarounds.

Do not write comments that merely repeat the code.

## General Principles

Prefer clarity over cleverness.

Prefer explicit domain models over generic abstractions.

Avoid premature optimization.

Avoid abstractions that are used only once without a clear future need.

Keep gameplay logic independent from framework-specific code.

Optimize V0 for correctness, testability, and ease of change.
