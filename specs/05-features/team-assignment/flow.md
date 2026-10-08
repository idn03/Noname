# Team Assignment Flow

1. The Host submits a valid start request from the lobby.
2. The server snapshots the connected players, including the Host, and passes the start command to the Game Engine.
3. The Game Engine randomly assigns all players to Wolf or Sheep with the required balance.
4. The server commits the transition to team assignment and card selection as one authoritative state change.
5. The server publishes each player's authorized game view and the team assignment.

If validation or assignment fails, the game remains in the lobby with no partial teams.
