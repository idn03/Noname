# Architecture

## System Model

V0 uses a host-authoritative client-server model. One Host machine runs the Next.js application, Socket.IO server, Game Engine, and SQLite database. All players, including the Host, connect through browsers on the same LAN or Wi-Fi. The Host participates as a normal player.

## Layers and Responsibilities

The application has these logical layers, with dependencies directed toward domain behavior:

1. **Presentation:** Next.js and React render the interface; components contain no core game rules.
2. **Client state and realtime:** Zustand holds shared client state received from the server. It does not calculate authoritative scores, turns, teams, or outcomes.
3. **Transport:** Socket.IO carries player intentions and server updates. Handlers validate requests before invoking operations.
4. **Application services:** Coordinate validated requests, Game Engine operations, and persistence.
5. **Game Engine:** Owns team assignment, phase transitions, card selection, turns, attack/defense resolution, scoring, and win conditions.
6. **Persistence:** SQLite stores data that must survive restarts; Drizzle ORM is the only database access layer.

## Authority and State

The Host server is the source of truth. Clients send intentions such as joining, starting, selecting, attacking, defending, or completing a challenge. The server validates each game-changing action and applies valid state transitions before broadcasting updated state or relevant events.

Never trust clients for scores, team assignment, card ownership, turn order, phase, or challenge results that require validation. Keep temporary realtime state in memory when persistence is unnecessary for V0.

## Game Engine Boundary

The Game Engine contains gameplay rules and exposes operations that accept current state and commands and return validated transitions. It must remain independent of React, Next.js UI, Socket.IO connection objects, and database implementation. Database code contains no gameplay rules.

## Failure and Scope

Invalid commands do not modify game state. Unexpected client disconnections must not crash the server; separate transport errors from game-rule errors and use predictable client error codes when possible. Avoid distributed infrastructure that V0 does not need.
