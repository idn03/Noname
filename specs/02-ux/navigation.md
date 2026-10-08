# Navigation

## Navigation Model

V0 is a single-session game with phase-based screens rather than a multi-section application. The server-provided session phase determines the main screen. A browser refresh restores the player's current authorized screen when the active Host session and player credential remain valid.

## Main Destinations

- **Join:** Enter a display name or resume a valid player session.
- **Lobby:** View player presence and, for the Host, the available start and cancel controls.
- **Team and selection:** View personal team assignment, manage the player's own card slot, and see selection readiness. Wolf players also have access to the challenge pool.
- **Gameplay:** Follow the active round, reveal or defend when eligible, view the current challenge, and track scores.
- **Results:** View final team scores and the winner or draw.

## Transitions and Access

- Joining successfully opens the lobby. An invalid or closed join remains on Join with a safe explanation.
- Starting moves all players from Lobby to team assignment and card selection.
- Complete submitted selections move all players to Gameplay. Selection controls are then unavailable.
- Each resolved round updates the Gameplay view. Completion of the final round opens Results.
- Host cancellation ends the active session and returns connected players to Join.
- Players may only see actions authorized for their identity, role, and current phase. Ineligible actions are unavailable or clearly disabled, and server rejection is shown without changing the displayed authoritative state.

## Browser and Device Behavior

The same phase flow applies on phone, tablet, and desktop browsers. Navigation must not depend on hover, and primary actions must remain reachable on narrow screens. Browser back or refresh must not create a second player or locally change the game phase.
