# Project Glossary

Use these terms consistently across the specifications and application.

## Game Roles

- **Host:** Player whose machine runs the server and session; may start or cancel a game and also plays.
- **Player:** Person connected to the current session through a browser.
- **Wolf:** Attacking team; selects and plays cards that generate challenges.
- **Sheep:** Defending team; predicts and counters Wolf cards using matching categories.

## Session

- **Game Session:** Multiplayer session managed by the Host, from lobby creation until ending or cancellation.
- **Lobby:** Waiting state before a game starts; players may join.
- **Game:** One playable match between Wolf and Sheep.
- **Game Phase:** Major lifecycle stage, such as lobby, team assignment, card selection, turn, or result.
- **Game State:** Authoritative data for the current game, including players, teams, cards, scores, phase, turns, and timers as applicable.

## Cards and Challenges

- **Card:** Playable object owned or selected by a team; belongs to one category.
- **Card Category:** Thematic classification, such as music, travel, technology, geography, economy, or folklore.
- **Card Slot:** Team position for one selected card; slot count depends on team size.
- **Card Selection:** Phase in which teams choose cards for the game.
- **Challenge:** Truth-or-Dare-style task associated with a category and presented when a matching card is played.

## Turns and Scoring

- **Turn:** One attack-defense cycle in the main gameplay phase.
- **Attacker / Defender:** Wolf / Sheep during V0 gameplay.
- **Attack:** Wolf reveals or plays a selected card.
- **Defense:** Sheep responds with an eligible card.
- **Successful Defense:** Defense satisfying the category-matching rule.
- **Failed Defense:** State where Sheep cannot or does not successfully defend.
- **Score:** Numerical value accumulated by a team.
- **Score Event:** Action or outcome that changes a team's score.
- **Winner:** Team with the highest valid score after all required turns; a tie is a draw.

## Networking and Technical Terms

- **Client:** Browser instance connected to the Host server.
- **Server:** Authoritative application process on the Host machine.
- **Socket:** Persistent Socket.IO connection between a client and server.
- **Server-Authoritative State:** Model where the server owns game state and validates changes.
- **Synchronization:** Keeping relevant game state consistent across connected clients.
- **Game Engine:** TypeScript module for game rules, state transitions, scoring, and validation; not an external engine such as Unity or Godot.
- **Static Game Data:** Content not representing an active match, such as card categories and challenge definitions.
- **State Transition:** Validated change from one game state or phase to another.
