# Scoring and Results Flow

1. The Host records the challenge result determined by participating players or the Host; the Game Engine receives that result with the attack and defense outcome.
2. An undefended attack awards Wolf 2 points.
3. A successful defense awards Sheep 1 point. A successful challenge adds 1 more Sheep point.
4. The server publishes the updated score and round state to connected players.
5. After the configured rounds, the Game Engine compares team scores and enters the result phase.
6. The server publishes final scores and the winning team, or a draw, to every connected player.
