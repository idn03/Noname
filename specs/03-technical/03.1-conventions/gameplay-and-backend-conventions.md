# Gameplay and Backend Conventions

## Game Logic

Core game logic must be deterministic whenever possible.

Game Engine functions must not depend directly on UI state.

Random behavior must be isolated behind explicit utilities or injected dependencies so it can be tested.

Game rules must not be duplicated between client and server.

The server implementation is authoritative.

## Socket.IO

Socket event names must be centralized.

Do not scatter raw event strings throughout the codebase.

Use typed payloads for both client-to-server and server-to-client events.

Prefer intent-based event names.

Examples:

```text
player:join
game:start
card:select
turn:attack
turn:defend
game:state
game:error
```

Every server-side event handler must validate its payload and current game state before performing mutations.

## Database Code

All SQLite access must go through Drizzle ORM.

Database queries should be isolated from React components and Game Engine rules.

Schema changes must be represented through migrations.

Avoid storing derived values when they can be safely calculated from authoritative data.
