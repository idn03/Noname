# Project Structure

Organize the application by responsibility. Keep gameplay rules independent from the UI, transport, and persistence layers. Use TypeScript and kebab-case paths, except React component files may use PascalCase when they contain one primary component.

## Application Areas

- **`app/`** — Next.js routes, layouts, and page composition.
- **`components/`** — shared React interface components, including shadcn/ui components.
- **`features/`** — feature-specific UI and client behavior, grouped by feature.
- **`stores/`** — shared Zustand client state and explicit state actions.
- **`server/`** — Host-side application services and Socket.IO setup and handlers.
- **`game/`** — the custom Game Engine, domain types, rules, and state transitions. This area must not depend on React, Next.js, Socket.IO, or database code.
- **`db/`** — Drizzle schema, database access, and migrations for SQLite.
- **`shared/`** — genuinely reusable contracts and types shared across client and server; do not place feature-specific logic here.
- **`tests/`** — shared test setup and end-to-end tests. Keep focused unit and integration tests near the code they cover when practical.

## Dependency Boundaries

Keep dependencies directed from the interface and server services toward domain behavior. Socket.IO handlers validate requests and call application or game operations; they do not implement game rules. Database access stays in `db/` and does not enter React components or the Game Engine. Client state reflects server-provided authoritative state and does not calculate game outcomes.
