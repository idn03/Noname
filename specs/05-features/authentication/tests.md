# Player Identity and Session Tests

## Unit and Integration Coverage

- A valid display name is trimmed and accepted; whitespace-only, over-limit, and control-character names are rejected.
- Duplicate display names create distinct player identities and do not authorize one player as another.
- An accepted join creates one identity; a rejected join does not mutate lobby membership.
- The Host and disconnected participants count toward the 10-player session limit; only connected players count toward the start minimum; new joins are rejected after the game starts.
- Only the server-designated Host can use Host operations; client-supplied identity or role claims do not grant access.
- Commands without a valid connection identity are rejected without changing state.
- A valid credential reconnects to the same player and current authorized view without creating a duplicate.
- Invalid, expired, or ended-session credentials cannot resume a player; a completed or cancelled session invalidates its credentials.
- Disconnecting updates lobby presence, retains the participant's session place for reconnect, and does not corrupt active game state.
- Client errors use stable codes and safe messages; credentials and raw implementation errors are not exposed.

## Browser Flow Coverage

- A player can enter a valid display name, join the lobby, and see their presence reflected in the player list.
- Invalid names and closed or full lobbies provide clear feedback and do not create a player.
- Refreshing the browser during an active Host session restores the same player and authorized view.
- Two players with the same display name remain separate session participants.

Use Vitest for unit and integration coverage and Playwright for browser flows, following the project testing conventions.

Do not treat an unavailable or skipped required check as passing.
