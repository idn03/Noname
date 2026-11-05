# Team Assignment Flow

1. The Host submits a valid start request from the lobby.
2. The server snapshots the connected joining players, excluding the Host, and passes them to the Game Engine.
3. The Game Engine randomly assigns the joining players to Wolf or Sheep with the required balance.
4. The server publishes the full assignment to the Host and only each player's own team to that player, then holds the Team Assignment phase for 10 seconds.
5. The Host sees each team's roster members move from the lobby frame in sequence, one second per member; both teams animate concurrently. Players see their assigned team and a preparation countdown. Reconnection or refresh restores the remaining assignment time.
6. After 10 seconds, the server opens card selection and starts its selection timer.

If validation or assignment fails, the game remains in the lobby with no partial teams.
