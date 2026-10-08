# Backend Architecture

## Runtime

Run the Next.js application, Socket.IO server, application services, Game Engine, and SQLite database on the Host machine. V0 has one active game session and requires no cloud service or distributed backend.

## Responsibilities

- **Transport** accepts Socket.IO connections, validates incoming messages, applies authorization, and returns safe responses.
- **Application services** coordinate session operations, Game Engine transitions, and persistence.
- **Game Engine** owns deterministic gameplay rules and state transitions. It has no dependency on sockets, UI, or database code.
- **Persistence** accesses SQLite only through Drizzle ORM and stores data required to survive process restarts.

Keep authoritative live game state on the server. Clients submit player intentions; the server validates and applies them before publishing updated views. Invalid operations leave state unchanged.

## Connection and Recovery

Each connected player is associated with a server-issued identity. A reconnecting client may resume that identity while its session remains valid and the Host process is running. On connection or reconnection, send the player an authorized current view so a browser refresh can recover without making client state authoritative.

Disconnections must not crash the server or corrupt game state. Update lobby presence for other players. Do not promise recovery across a Host process restart unless the active game is explicitly persisted by a future requirement.

## Boundaries

Keep Socket.IO-specific behavior in the transport layer. Keep database operations out of React and Game Engine code. Translate expected domain and infrastructure failures into the client error contract; log unexpected server failures without exposing internals.
