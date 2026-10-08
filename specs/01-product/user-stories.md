# User Stories

## US-001 — Join Session

**As a player,** I want to enter my name and join the Host's game so I can participate. **Acceptance:** I can enter a display name, appear in the lobby after joining, and the player list updates for others.

## US-002 — View Players

**As a player,** I want to see who joined so I know when the group is ready. **Acceptance:** The lobby lists connected players and updates when players join or leave.

## US-003 — Start Game

**As the Host,** I want to start the game so all connected players can begin. **Acceptance:** Only the Host can start; at least 6 players must be connected; all players are assigned to a team.

## US-004 — View My Team

**As a player,** I want to know whether I am Wolf or Sheep so I understand my role. **Acceptance:** Every player belongs to exactly one team, and assignment is synchronized across clients.

## US-005 — Select Personal Card

**As a player,** I want to select, replace, or remove the card in my personal team slot so I can contribute to my team's strategy. **Acceptance:** Each player manages one slot, duplicate categories are allowed, and the game leaves selection only after every player has submitted a complete slot.

## US-006 — Inspect Challenges

**As a Wolf player,** I want to inspect challenges by category so my team can choose attack cards strategically. **Acceptance:** Wolf can view the available pool; Sheep cannot access it.

## US-007 — Play Attack Card

**As a Wolf player,** I want to reveal the unused card in my own slot to attack Sheep. **Acceptance:** Only the player who selected a card may reveal it; only one attack is active at a time; the category is revealed and its challenge becomes available.

## US-008 — Defend an Attack

**As a Sheep player,** I want to defend with a matching category card from my own slot and handle its challenge. **Acceptance:** The defense card must be unused and match the attack category; only one defense resolves an attack; successful defense awards Sheep 1 point.

## US-009 — Complete Challenge

**As a Sheep player,** I want to attempt the challenge after defending so my team can earn another point. **Acceptance:** The challenge matches the attack category; the Host records its outcome; successful completion awards Sheep 1 additional point.

## US-010 — Track Score

**As a player,** I want to see the current score. **Acceptance:** Scores update after each scoring event and all connected players receive the same score state.

## US-011 — View Result

**As a player,** I want to see the final result. **Acceptance:** The game ends after all rounds; final scores and the winner or draw are displayed.

## US-012 — Cancel Session

**As the Host,** I want to cancel an active game so the group can stop or restart. **Acceptance:** Only the Host can cancel; all connected clients are notified and active game state is terminated.
