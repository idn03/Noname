# Database

## Storage

Use a local SQLite database on the Host machine and access it only through Drizzle ORM in `backend/db/`. The database is not reachable from browsers. Keep database concerns independent from React components and Game Engine rules.

## Data Responsibilities

Persist predefined card categories and challenge content that must be available across server restarts. Keep challenge content separate from active game state. Store only data needed by V0; the product does not require player accounts or game history.

Keep the active session and live gameplay state in server memory for V0 unless a later requirement explicitly adds durable recovery. A browser refresh reconnects to the running Host session; persistence across a Host restart is not promised. Do not persist derived values when they can be safely calculated from authoritative data.

## Schema and Migrations

Represent schema changes as ordered migrations and apply them predictably when the Host starts. Migrations must preserve existing challenge data or fail safely with a useful Host-side error. Keep seed or bundled content versioned and distinguish it from player-generated data.

## Integrity and Failure

Use database constraints and transactions where needed to preserve data integrity. Validate external values before database operations and use Drizzle queries rather than constructing SQL from user input. Translate database failures into safe application errors; never return SQL, paths, schema details, or raw database exceptions to clients.

Backups, remote database services, multi-Host coordination, and durable live-game recovery are outside V0 scope.
