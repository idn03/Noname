# User Stories

## Joining the Game

### US-001 — Join Session

**As a player,**  
I want to enter my name and join the Host's game,  
so that I can participate in the session.

**Acceptance Criteria**
- The player can enter a display name.
- The player appears in the lobby after joining.
- Other connected players receive the updated player list.

## Waiting Lobby

### US-002 — View Players

**As a player,**  
I want to see who has joined the game,  
so that I know when the group is ready.

**Acceptance Criteria**
- Connected players are listed in the lobby.
- The list updates when players join or leave.

## Starting the Game

### US-003 — Start Game

**As the Host,**  
I want to start the game,  
so that all connected players can begin playing.

**Acceptance Criteria**
- Only the Host can start the game.
- At least 6 players must be connected.
- All players are assigned to a team.

## Team Assignment

### US-004 — View My Team

**As a player,**  
I want to know whether I am Wolf or Sheep,  
so that I understand my role in the game.

**Acceptance Criteria**
- Every player belongs to exactly one team.
- Team assignment is synchronized across clients.

## Selecting Cards

### US-005 — Select Team Cards

**As a team member,**  
I want to select cards for my team,  
so that we can prepare our strategy.

**Acceptance Criteria**
- The team receives the correct number of card slots.
- Multiple cards from the same category may be selected.
- All slots must be filled before selection finishes.

### US-006 — Inspect Challenges

**As a Wolf player,**  
I want to inspect possible challenges for each category,  
so that my team can strategically choose attack cards.

**Acceptance Criteria**
- Wolf can view the available challenge pool.
- Sheep cannot access this information.

## Attacking

### US-007 — Play Attack Card

**As a Wolf player,**  
I want my team to reveal an unused card,  
so that we can attack Sheep during the current round.

**Acceptance Criteria**
- Only unused Wolf cards may be selected.
- The selected card category is revealed.
- The associated challenge becomes available.

## Defending

### US-008 — Defend an Attack

**As a Sheep player,**  
I want to use a matching category card,  
so that my team can defend against Wolf.

**Acceptance Criteria**
- Only a card matching the attack category is valid.
- The defending card must be unused.
- Successful defense awards Sheep 1 point.

## Completing Challenges

### US-009 — Complete Challenge

**As a Sheep player,**  
I want to attempt the challenge after defending,  
so that my team can earn an additional point.

**Acceptance Criteria**
- The challenge belongs to the attack category.
- Successful completion awards Sheep 1 additional point.

## Viewing Scores

### US-010 — Track Score

**As a player,**  
I want to see the current score,  
so that I know how both teams are performing.

**Acceptance Criteria**
- Scores update after each scoring event.
- All connected players receive the same score state.

## Finishing the Game

### US-011 — View Result

**As a player,**  
I want to see the final result,  
so that I know which team won.

**Acceptance Criteria**
- The game ends after all rounds are completed.
- Final scores are displayed.
- The winning team or draw result is displayed.

## Cancelling the Game

### US-012 — Cancel Session

**As the Host,**  
I want to cancel an active game,  
so that the group can stop or restart the session.

**Acceptance Criteria**
- Only the Host can cancel the game.
- Every connected client is notified.
- The active game state is terminated.