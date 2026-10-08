# Application Flow

## Entry and Lobby

1. A player opens the Host's local game in a browser.
2. A new player enters a display name and joins. A returning player with a valid session resumes their existing identity.
3. The lobby shows connected players and the current player count. The Host can start when at least six players are connected; the session limit is ten identities.
4. The Host starts the game. The server assigns every connected player, including the Host, to Wolf or Sheep and opens card selection.

## Card Selection

1. Each player sees their own team, personal slot, available categories, and selection timer.
2. Wolf players may inspect the available challenges. Sheep players do not receive Wolf selections or challenge pools.
3. A player chooses a local draft and submits it with Done. They may replace or remove a submitted selection while the phase remains open; an edited or removed selection must be submitted again.
4. The interface shows each player's readiness without exposing private selections.
5. When all players have submitted a complete selection, the server advances to gameplay and locks selections. Timer expiry does not fill missing slots or advance the phase.

## Turn Gameplay

1. The active round prompts the eligible Wolf card owner to reveal their unused card.
2. The revealed category and its challenge are shown to players. Sheep players with an unused matching card may defend; the first valid defense accepted resolves the attack.
3. The defending Sheep player handles the challenge. The Host records the agreed outcome.
4. The interface presents the resolved outcome and updated scores, then the next round begins. An undefended attack resolves under the published scoring rules.
5. After all scheduled rounds, the result view shows final scores and the winner or draw.

## Cancellation and Recovery

- The Host may cancel an active session. All connected players are returned to the join experience after the server ends the session.
- On refresh or temporary disconnect, a player with a valid session resumes at the current phase with their authorized view. The interface must not imply that an unconfirmed action succeeded.
- Rejected actions preserve the current screen and show a safe, understandable error. The player can retry when the current state permits it.
