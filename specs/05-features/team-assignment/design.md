# Team Assignment Design

## Goal

Assign every player in the session to exactly one team when the Host starts the game.

## Assignment Rules

The Game Engine performs the assignment using isolated randomness. Team sizes are equal for an even player count. For an odd count, one randomly selected team receives the extra player. The Host participates in assignment like every other player.

The server publishes the resulting team state. Team assignment remains fixed for the game and does not depend on client-side state.
