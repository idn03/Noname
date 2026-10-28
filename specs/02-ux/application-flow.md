# Application Flow

## Entry and Lobby

1. The person running the server opens the local browser page and presses TẠO to create the room as Host; no Host display name is required. Holding TẠO for three seconds creates a Sandbox room for Playwright Test, with 6–10 simulated players in addition to the Host.
2. Other players open the Host's LAN address, see a concise rules overview with options to read Wolf or Sheep rules, and return to Join.
3. A new player enters a display name and joins. A returning player with a valid session resumes their existing identity.
4. The lobby shows joined players and their count, excluding the Host. The Host can start with at least six joined players; starting below ten requires Host confirmation. The Host can delete the room to recreate it.
5. The Host starts the game. The server assigns all joined players to Wolf or Sheep and opens card selection; the Host remains an observer. Sandbox populates its 6–10 simulated-player roster automatically.

## Card Selection

1. Each player sees their own team, personal slot, available categories, and selection timer.
2. Wolf and Sheep players may inspect the available challenges. Sheep players do not receive Wolf selections.
3. A player chooses a local draft and submits it with Done. They may replace or remove a submitted selection while the phase remains open; an edited or removed selection must be submitted again.
4. The interface shows each player's readiness without exposing private selections.
5. When all players have submitted a complete selection, the server advances to gameplay and locks selections. Timer expiry does not fill missing slots or advance the phase.

## Turn Gameplay

1. The active round prompts the eligible Wolf card owner to reveal their unused card.
2. The revealed category and its challenge are shown to players. Sheep players with an unused matching card may defend; the first valid defense accepted resolves the attack.
3. The defending Sheep player handles the challenge. The Host records the agreed outcome.
4. The interface presents the resolved outcome and updated scores, then the next round begins. An undefended attack resolves under the published scoring rules.
5. After all scheduled rounds, the result view shows final scores and the winner or draw.

## Host Match Management

- The Host can open a concise round-by-round text history from the footer in the lobby, selection, or match-management view.
- The Host match-management view shows the current round and Wolf attack card and provides Hoàn Thành and X controls.
- The Host can cancel the match, returning all players to HomeScreen, or replay it with the same team assignments from card selection.
- Sandbox selection automatically fills every Wolf slot with Music and a random challenge, and fills Sheep with two Music cards and one Travel card.

## Cancellation and Recovery

- The Host may cancel an active session. All connected players are returned to HomeScreen after the server ends the session.
- On refresh or temporary disconnect, a player with a valid session resumes at the current phase with their authorized view. The interface must not imply that an unconfirmed action succeeded.
- Rejected actions preserve the current screen and show a safe, understandable error. The player can retry when the current state permits it.
