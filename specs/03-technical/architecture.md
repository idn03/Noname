# Architecture

## Purpose

This document defines the high-level architecture of the V0 application.

The architecture prioritizes:

- Clear separation of responsibilities.
- Deterministic game logic.
- Real-time synchronization.
- Local network deployment.
- Testability and maintainability.

Detailed gameplay rules must be defined in separate specifications.

## System Model

The application follows a host-authoritative client-server architecture.

One machine acts as the Host and runs:

- Next.js application.
- Socket.IO server.
- Game Engine.
- SQLite database.

All players, including the Host, connect to the application through a web browser over the same LAN or Wi-Fi network.

The Host is also a normal game participant.

## Architectural Layers

The application is divided into the following logical layers:

```text
Presentation Layer
        ↓
Client State / Realtime Layer
        ↓
Socket.IO Transport
        ↓
Application Services
        ↓
Game Engine
        ↓
Persistence Layer
```

Dependencies should flow downward whenever possible.

## Frontend Architecture

Next.js is responsible for rendering pages and application UI.

React components must not contain core game rules.

Zustand stores client-side state such as:

- Current player information.
- Current room state.
- Team information.
- Game phase.
- Server-provided game state.

Server state received through Socket.IO remains authoritative.

The client must not independently calculate authoritative scores, turns, teams, or game outcomes.

## Realtime Communication

Socket.IO is the primary communication mechanism during an active session.

Clients send player intentions such as:

- Join room.
- Start game.
- Select card.
- Attack.
- Defend.
- Complete challenge.

The server validates the action before modifying game state.

After a valid state transition, the server broadcasts the updated state or relevant event to connected clients.

## Game Engine

The Game Engine contains all core gameplay rules.

It must remain independent from:

- React.
- Next.js UI.
- Socket.IO connection objects.
- Database implementation details.

The engine should expose explicit operations that receive current state and commands and return validated state transitions.

Core responsibilities include:

- Team assignment.
- Game phase transitions.
- Card selection rules.
- Turn progression.
- Attack and defense resolution.
- Score calculation.
- Win-condition evaluation.

## Server Authority

The Host server is the single source of truth.

Clients must never be trusted for:

- Scores.
- Team assignment.
- Card ownership.
- Turn order.
- Game phase.
- Challenge completion results requiring validation.

Every game-changing request must be validated on the server.

## Persistence

SQLite stores data that must survive application restarts.

Drizzle ORM is the only supported database access layer.

Database code must not contain gameplay rules.

Temporary realtime state may remain in memory when persistence is unnecessary for V0.

## Failure Handling

Invalid commands must not modify game state.

Unexpected client disconnections must not crash the game server.

Transport errors should be separated from game-rule errors.

Errors sent to clients should use predictable error codes whenever possible.

## V0 Constraints

Architecture changes that introduce unnecessary distributed infrastructure should be avoided.