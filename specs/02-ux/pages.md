# Pages and UI States

Visual frame links and shared presentation guidance are in
[Figma Interface References](figma-references.md).

## Join

Provide a display-name field and a clear join action. Include a concise overview of the game rules and two clearly labeled options to open the Wolf rules and Sheep rules. Each team rules page explains that team's objective, actions, and relevant scoring at a player-friendly level, without exposing session-specific private game information. Provide a clear way back to Join from either rules page. Explain validation errors inline or in an accessible status message. A returning player with a valid session proceeds to their current game view without joining twice.

## Host Setup

On the server machine's local browser page, let the Host press TẠO to create the room; no Host display-name entry is required. A three-second press-and-hold on TẠO creates a Sandbox room. LAN clients cannot see or use Host session-creation controls.

## Lobby

Show the session status, joined-player list, and joined-player count against the 6–10 range, excluding the Host. Identify the Host separately and distinguish disconnected participants where relevant. In the Host view, show CHƠI and explain that starting below ten joined players requires confirmation; at least six joined players are required. Show “Xóa phòng này” for the Host to discard and recreate a room. Provide Host match-history and cancel-match actions in the shared footer.

## Team Assignment and Card Selection

Show the player's team and their own card slot. Provide category choices, selection submission status, and overall readiness. Let players edit their own selection only while the Selection Phase is active. Show the timer and explain that selection remains open after expiry until all slots are submitted. Wolf views include the available challenge pool; Sheep views do not expose Wolf selections or that pool.

The Host view shows both team rosters, selected-card counts, and remaining time. The Host observes the full selection state but has no team or card slot. In Sandbox, player selections are populated automatically.

## Host Match Management

ManageGameScreen is Host-only. Show the current round and the Wolf attack card for that round, with Hoàn Thành and X controls. Provide match history, cancel-match, and replay actions in the shared footer on Lobby, selection, and match-management screens. History is a concise, text-based report grouped by round and team, showing score changes and attack, defense, and challenge outcomes. Replay retains team assignments and returns everyone to card selection. Cancel ends the match and returns everyone to HomeScreen.

## Sandbox

Sandbox rooms support Playwright CLI interface and feature testing. They contain 6–10 simulated players in addition to the Host and allow the Host to start team assignment. During selection, automatically choose Music for every Wolf slot and a random challenge; choose two Music cards and one Travel card for Sheep. Sandbox rooms reject real players joining through a link.

## Screens and Shared Components

Screens: HomeScreen (Host and player), LobbyScreen (Host and player), SelectCardScreen (Host and player), ManageGameScreen (Host), GameScreen (player), SheepTeamScreen (player), WolfTeamScreen (player), EndGameScreen (Host and player). Shared components: Button, CardFrame, PlayerNameTag, CardTag.

## Gameplay

Keep the current round, team scores, active attack or waiting state, and available action visible. Only the owner of an eligible unused Wolf card can reveal it. Sheep can defend only with their own eligible matching card. During an active challenge, show its text and make the Host's outcome-recording control available only to the Host. Clearly indicate when an attack is undefended or resolved and when play advances.

When a Sheep player is handling a challenge, the Host sees the active challenge and can record its outcome using the Thành Công and Thất Bại buttons. Only one outcome may be recorded for an active challenge.

## Results

Show both final team scores, the winning team or draw, and that the session is complete. Present the result consistently to all connected players.

## Shared States

- **Connecting or reconnecting:** Indicate that the client is restoring its authorized session view.
- **Waiting:** Explain which player action or phase gate is pending without exposing private information.
- **Action pending:** Prevent duplicate submission where practical and wait for server confirmation.
- **Error:** Use a concise, safe message; preserve the last confirmed game state and provide a recovery action when available.
- **Disconnected:** Make connection loss clear and offer reconnection. Do not imply that authoritative gameplay state has been lost.

Do not present client-side guesses as confirmed teams, card selections, scores, phase transitions, or challenge outcomes.
