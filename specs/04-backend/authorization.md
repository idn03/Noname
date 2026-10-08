# Authorization

## General Rules

Authorize every state-changing command on the Host using the connection's server-controlled player identity, Host status, team membership, and current game phase. Validate authorization before invoking mutations. A rejected command leaves authoritative state unchanged.

Players may act only for themselves. A player may select, replace, or remove only the card in their own slot while selection is open. Only the player who selected a Wolf card may reveal it, and only while it is unused and no other attack is active. A Sheep defense must use an unused matching-category card from the defending player's own slot. Gameplay actions must be permitted for the active phase, round, team, and turn. The Game Engine remains the final authority for game-rule validity.

When more than one Sheep player can defend an attack, accept at most one valid defense; the first valid defense processed resolves that attack. Reject further defense actions for the resolved attack.

## Host Operations

Only the server-designated Host may start or cancel the game. Starting requires the minimum player count and other game-start invariants. Host status grants session-management authority, not a gameplay advantage; the Host participates as a regular player.

## Information Access

Filter every state response for the receiving player's permissions. Wolf players may inspect the available challenge pool during selection. Sheep players must not receive Wolf's selected cards before reveal. Send each player only team, card, challenge, and session information they are allowed to observe. UI hiding is not an authorization boundary.

## Non-Participants and Invalid State

Connections without a valid session identity cannot issue player or Host commands. Unknown events, invalid membership, and actions for the wrong phase or role are rejected using the safe error contract. Do not let client-supplied role, team, or permission fields affect authorization.
