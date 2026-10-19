# Session Management Requirements

- **SES-001 — Single Session:** Support one active game session on the Host machine.
- **SES-008 — Host Session Creation:** Create the active lobby only when the local player running the server presses TẠO. Host name entry is not required. Reject creation from LAN clients and while another session is active.
- **SES-002 — Lobby:** Keep the session in a lobby until the Host starts a game.
- **SES-003 — Player Count:** Permit 6–10 joining players, excluding the Host. The Host can start only when at least 6 joining players are connected.
- **SES-004 — Host Start:** Accept start requests only from the server-designated Host and only when game-start invariants hold.
- **SES-005 — Host Cancel:** Accept cancellation only from the server-designated Host; cancellation ends the current game session and notifies connected clients.
- **SES-006 — Invalid Requests:** Reject start and cancel requests that are unauthorized or invalid for the current session state without partially changing the session.
- **SES-007 — Host Observer:** The Host is not a player, is not assigned to a team, and has no card slot or player turn. The Host can observe and manage the whole session through Host controls.
- **SES-009 — Low-Population Confirmation:** Permit Host start with 6–9 joining players only after explicit confirmation; reject starts below six or above ten.
- **SES-010 — Delete Room:** Allow the Host to discard the active room and create a replacement; notify connected clients and clear its session state.
- **SES-011 — Replay Match:** Allow the Host to restart selection while retaining the current team assignments.
- **SES-012 — Sandbox Room:** A three-second TẠO hold creates a room with 6–10 simulated players in addition to the Host for Playwright CLI interface and feature testing. Reject real-player link joins to Sandbox rooms.

Detailed player admission and identity requirements are in [authentication](../authentication/requirements.md).
