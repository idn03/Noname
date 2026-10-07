# Code Quality and Maintainability Conventions

## Imports and Dependencies

Prefer project aliases over long relative import chains.

Avoid circular dependencies.

Feature-specific code must not be imported into unrelated features.

Shared modules should contain only genuinely reusable functionality.

## Comments

Code should be self-explanatory through naming and structure.

Use comments to explain:

- Non-obvious decisions.
- Game-rule reasoning.
- Technical constraints.
- Workarounds.

Do not write comments that merely repeat the code.

## General Principles

Prefer explicit domain models over generic abstractions.

Avoid premature optimization.

Optimize V0 for correctness, testability, and ease of change.
