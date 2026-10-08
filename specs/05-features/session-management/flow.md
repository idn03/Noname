# Session Management Flow

## Start

1. Players join the lobby and the server updates connected-player presence.
2. The Host requests to start the game.
3. The server verifies Host authority, the connected-player count, and start invariants.
4. On success, the Game Engine begins the game and the server publishes the new phase and authorized state.
5. On rejection, the session remains unchanged and the Host receives a safe error.

## Cancel

1. The Host requests cancellation while a session is active.
2. The server verifies Host authority and ends the active session.
3. The server notifies connected clients and clears active game state.

Players cannot start or cancel a session by changing client state or submitting Host claims.
