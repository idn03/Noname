# Coding Conventions

## Purpose

This document defines the shared coding conventions for the project: language,
naming, functions, type definitions, imports, comments, and general principles.

All production and test code should follow these rules unless another
specification explicitly overrides them. Topic-specific conventions are
documented separately:

- [Frontend conventions](./frontend-conventions.md) cover React components and
  client-side state management.
- [Gameplay and backend conventions](./gameplay-and-backend-conventions.md)
  cover game logic, Socket.IO, and database access.
- [Testing conventions](./testing-conventions.md) cover test frameworks and
  test description style.
- [Code quality and maintainability conventions](./code-quality-and-maintainability-conventions.md)
  cover imports, comments, and general principles.

## Language

Use TypeScript for application code.

Avoid JavaScript files unless required by external tooling.

Enable and preserve strict TypeScript checks.

Do not use `any` unless integration with an external library makes it unavoidable.

Prefer `unknown` when the type is not yet validated.

## Naming

Use:

- `PascalCase` for React components, classes, enums, and exported types.
- `camelCase` for variables, functions, hooks, and object properties.
- `UPPER_SNAKE_CASE` for global constants.
- `kebab-case` for general file and directory names.

React component files may use `PascalCase` when the file contains one primary component.

Examples:

```text
game-engine.ts
socket-events.ts
player-store.ts
GameBoard.tsx
PlayerCard.tsx
```

## Functions

Prefer small functions with one clear responsibility.

Use descriptive verb-based names.

Examples:

```ts
assignPlayersToTeams()
validateAttack()
calculateRoundScore()
advanceTurn()
```

Avoid generic names such as:

```ts
handleData()
process()
doAction()
manageGame()
```

Pure functions are preferred for game logic.

## Type Definitions

Prefer explicit domain types.

Example:

```ts
type Team = 'wolf' | 'sheep';

type GamePhase =
  | 'lobby'
  | 'card-selection'
  | 'playing'
  | 'finished';
```

Do not represent known domain states using arbitrary strings.

Avoid boolean parameters when an enum or union communicates intent more clearly.
