# Team Assignment Flow

1. The Host submits a valid start request from the lobby.
2. The server snapshots the connected joining players, excluding the Host, and passes them to the Game Engine.
3. The Game Engine randomly assigns the joining players to Wolf or Sheep with the required balance.
4. The server commits the transition to team assignment and card selection as one authoritative state change.
5. The server publishes the full assignment to the Host and only each player's own team to that player.

If validation or assignment fails, the game remains in the lobby with no partial teams.
