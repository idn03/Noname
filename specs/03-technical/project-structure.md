# Project Structure

Organize the application by responsibility. Keep gameplay rules independent from the UI, transport, and persistence layers. Use TypeScript and kebab-case paths, except React component files may use PascalCase when they contain one primary component.

## Application Areas

- **`web-game/`** — the complete browser-based game application, organized into the routes, shared interface components, feature-specific client behavior, client state, browser-side shared utilities, and game domain logic listed below. Keep browser concerns in this area and keep the game rules independent of UI, transport, and persistence.
    - **`app/`** — Next.js routes, layouts, and page composition.
    - **`components/`** — shared React interface components, including shadcn/ui components.
    - **`features/`** — feature-specific UI and client behavior, grouped by feature.
    - **`stores/`** — shared Zustand client state and explicit state actions.
    - **`shared/`** — browser-side contracts, types, and utilities reused by multiple web-game features; keep feature-specific behavior in its feature and cross-application contracts in root `shared/`.
    - **`game/`** — the custom Game Engine, domain types, rules, and state transitions. Keep gameplay rules independent of React, Next.js, transport, and persistence.
- **`backend/`** — host-side application services, Socket.IO setup and handlers, and database infrastructure.
- **`backend/db/`** — Drizzle schema, database access, and migrations for SQLite.
- **`shared/`** — genuinely reusable contracts and types shared across the web game and backend; do not place feature-specific logic here.
- **`tests/`** — shared test setup and end-to-end tests. Keep focused unit and integration tests near the code they cover when practical.

## Dependency Boundaries

Keep dependencies directed from the web interface and backend services toward domain behavior. Socket.IO handlers validate requests and call application or game operations; they do not implement game rules. Database access stays in `backend/db/` and does not enter React components or the Game Engine. Client state reflects server-provided authoritative state and does not calculate game outcomes.
