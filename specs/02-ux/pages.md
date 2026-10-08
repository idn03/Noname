# Pages and UI States

## Join

Provide a display-name field and a clear join action. Include a concise overview of the game rules and two clearly labeled options to open the Wolf rules and Sheep rules. Each team rules page explains that team's objective, actions, and relevant scoring at a player-friendly level, without exposing session-specific private game information. Provide a clear way back to Join from either rules page. Explain validation errors inline or in an accessible status message. A returning player with a valid session proceeds to their current game view without joining twice.

## Lobby

Show the session status, connected player list, and connected count against the 6–10 player range. Identify the Host and distinguish disconnected participants where relevant. Show Start only to the Host, and make its availability clear when fewer than six players are connected. Host cancellation is available while the session is active.

## Team Assignment and Card Selection

Show the player's team and their own card slot. Provide category choices, selection submission status, and overall readiness. Let players edit their own selection only while the Selection Phase is active. Show the timer and explain that selection remains open after expiry until all slots are submitted. Wolf views include the available challenge pool; Sheep views do not expose Wolf selections or that pool.

## Gameplay

Keep the current round, team scores, active attack or waiting state, and available action visible. Only the owner of an eligible unused Wolf card can reveal it. Sheep can defend only with their own eligible matching card. During an active challenge, show its text and make the Host's outcome-recording control available only to the Host. Clearly indicate when an attack is undefended or resolved and when play advances.

## Results

Show both final team scores, the winning team or draw, and that the session is complete. Present the result consistently to all connected players.

## Shared States

- **Connecting or reconnecting:** Indicate that the client is restoring its authorized session view.
- **Waiting:** Explain which player action or phase gate is pending without exposing private information.
- **Action pending:** Prevent duplicate submission where practical and wait for server confirmation.
- **Error:** Use a concise, safe message; preserve the last confirmed game state and provide a recovery action when available.
- **Disconnected:** Make connection loss clear and offer reconnection. Do not imply that authoritative gameplay state has been lost.

Do not present client-side guesses as confirmed teams, card selections, scores, phase transitions, or challenge outcomes.
