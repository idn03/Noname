# Frontend Conventions

## React Components

Components should focus on rendering and user interaction.

Do not place core game rules inside React components.

Extract reusable logic into:

- Hooks.
- Stores.
- Services.
- Game Engine modules.

Prefer composition over large configurable components.

A component should be split when it handles multiple unrelated responsibilities.

## State Management

Use Zustand only for shared client-side state.

Use local React state for state that belongs to one component or a small component subtree.

Do not duplicate authoritative server state across multiple stores.

State updates should use explicit actions instead of arbitrary mutations from UI components.
