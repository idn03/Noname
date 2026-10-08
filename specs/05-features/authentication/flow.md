# Player Identity and Join Flow

## New Player

1. The player opens the Host's game in a browser and submits a display name.
2. The server trims and validates the name, confirms that the game is accepting new lobby players, and checks the 10-player session capacity, including disconnected participants.
3. If accepted, the server creates a player identity and private session credential, associates the connection with that identity, and returns the player's authorized session view.
4. The server publishes the updated lobby presence and player list to connected players.
5. The player may issue commands only through the identity associated with their connection. The server determines Host privileges independently of client input.

## Invalid or Closed Join

Reject an empty or invalid name, a full lobby, or a new join after the game starts. Return a stable client error code and safe message. Do not create a player record or change the lobby on rejection.

## Disconnect and Reconnect

1. On disconnect, update the player's presence without crashing or corrupting the session. Keep the participant identity and session place for reconnection.
2. On refresh or reconnect, the browser presents its session credential.
3. If the credential maps to a player in the active Host session, restore that identity and return the current authorized view without creating a duplicate player.
4. If the credential is invalid or the session has ended, reject resumption and require a new lobby join when new joins are allowed.

## Session End

When the game is cancelled or the session ends, invalidate its player credentials. A later game requires players to join the new lobby again.
