# Session Management Requirements

- **SES-001 — Single Session:** Support one active game session on the Host machine.
- **SES-002 — Lobby:** Keep the session in a lobby until the Host starts a game.
- **SES-003 — Player Count:** Permit 6–10 players, including the Host. The Host can start only when at least 6 players are connected.
- **SES-004 — Host Start:** Accept start requests only from the server-designated Host and only when game-start invariants hold.
- **SES-005 — Host Cancel:** Accept cancellation only from the server-designated Host; cancellation ends the current game session and notifies connected clients.
- **SES-006 — Invalid Requests:** Reject start and cancel requests that are unauthorized or invalid for the current session state without partially changing the session.
- **SES-007 — Host Participation:** The Host is included as a normal player and receives no gameplay advantage from session controls.

Detailed player admission and identity requirements are in [authentication](../authentication/requirements.md).
