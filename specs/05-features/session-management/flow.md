# Session Management Flow

## Start

1. The person running the server opens the local browser page and presses TẠO to create a lobby; no display name is required and the server assigns the Host observer identity. A three-second hold creates a Sandbox lobby for Playwright Test interface and feature testing, with 6–10 simulated players in addition to the Host.
2. Other players join the lobby and the server updates connected-player presence.
3. The Host requests to start the game. For 6–9 joining players (excluding the Host), the Host confirms the low-population start.
4. The server verifies Host authority, player count, any required confirmation, and start invariants.
5. On success, the Game Engine assigns only joining players to teams and the server publishes the new phase and authorized state. The Host remains an observer.
6. On rejection, the session remains unchanged and the Host receives a safe error.

## Cancel

1. The Host requests cancellation while a session is active.
2. The server verifies Host authority and ends the active session.
3. The server notifies connected clients and clears active game state.

Players cannot start or cancel a session by changing client state or submitting Host claims.

## Delete and Replay

- The Host may delete the active room; the server ends it, notifies connected clients, and clears session state for room recreation.
- The Host may replay a match; the server retains team assignments, resets match and selection state, and returns all players to card selection.

## Sandbox

- Sandbox creation is Host-only and adds 6–10 simulated players in addition to the Host.
- Reject real-player admission by link while the active room is Sandbox.
