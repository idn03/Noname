# Navigation

## Navigation Model

V0 is a single-session game with phase-based screens rather than a multi-section application. The server-provided session phase determines the main screen. A browser refresh restores the player's current authorized screen when the active Host session and player credential remain valid.

## Main Destinations

- **HomeScreen:** Create a room as Host without entering a name, join an existing room as a player, or resume a valid player session. Holding TẠO for three seconds creates a Sandbox room for Playwright Test.
- **Team rules:** Read the team-specific rules from Join and return to Join to continue. These are informational views and do not reveal private session state.
- **LobbyScreen:** View player presence and, for the Host, start, delete-room, match-history, and cancel-match controls.
- **SelectCardScreen:** View team and selection progress. Host can observe both teams' rosters, selected-card counts, and remaining time without a player slot; players manage their own slot. Wolf and Sheep players have access to the challenge pool.
- **ManageGameScreen:** Host view of current round and Wolf attack card, with Hoàn Thành and X controls, match history, cancel, and replay actions.
- **GameScreen:** Follow the active round, reveal or defend when eligible, view the current challenge, and track scores.
- **Results:** View final team scores and the winner or draw.

## Transitions and Access

- Joining successfully opens the lobby. An invalid or closed join remains on Join with a safe explanation.
- Opening either team rules view from Join does not change the session; returning from it restores Join so the player can continue.
- Starting moves all players from Lobby to team assignment and card selection.
- Complete submitted selections move all players to Gameplay. Selection controls are then unavailable.
- Each resolved round updates the Gameplay view. Completion of the final round opens Results.
- Host cancellation ends the active session and returns connected players to HomeScreen.
- Host replay retains team assignments and returns all players to SelectCardScreen. Host cancellation ends the match and returns all players to HomeScreen.
- Deleting a room discards it so the Host can create a replacement. Sandbox rooms reject real players joining by link.
- Players may only see actions authorized for their identity, role, and current phase. Ineligible actions are unavailable or clearly disabled, and server rejection is shown without changing the displayed authoritative state.

## Browser and Device Behavior

The same phase flow applies on phone, tablet, and desktop browsers. Navigation must not depend on hover, and primary actions must remain reachable on narrow screens. Browser back or refresh must not create a second player or locally change the game phase.
