# Requirements

## Product Requirements

### R-001 — Local Multiplayer

The system shall allow multiple players to join a game hosted on the same LAN or Wi-Fi network.

### R-002 — Player Capacity

The system shall support between 6 and 10 active players in a game session.

### R-003 — Player Identity

The system shall allow a player to enter a display name before joining the game.

### R-004 — Host

The system shall designate the machine running the server as the Host.

### R-005 — Lobby

The system shall display connected players in a waiting lobby before the game starts.

### R-006 — Start Game

The Host shall be able to start the game when at least 6 players are connected.

### R-007 — Cancel Game

The Host shall be able to cancel an active game.

### R-008 — Team Assignment

The system shall randomly divide all players, including the Host, into Wolf and Sheep teams.

### R-009 — Balanced Teams

The system shall keep team sizes as balanced as possible.

### R-010 — Card Categories

The system shall provide multiple card categories containing predefined challenges.

### R-011 — Challenge Pool

The system shall randomly select up to 10 challenges from each available category for a game session.

### R-012 — Card Selection

The system shall allow each team to select cards before gameplay begins.

### R-013 — Selection Timer

The system shall limit card selection using a timer whose duration in minutes equals the number of card slots.

### R-014 — Wolf Information

The system shall allow Wolf players to view available challenges during card selection.

### R-015 — Hidden Information

The system shall prevent Sheep players from viewing Wolf's selected cards before they are revealed.

### R-016 — Attack

The system shall allow Wolf to reveal one unused card during each round.

### R-017 — Defense

The system shall allow Sheep to defend using an unused card with the same category.

### R-018 — Challenge

The system shall display a challenge associated with the attacking card's category.

### R-019 — Scoring

The system shall calculate scores according to the defined business rules.

### R-020 — Game Completion

The system shall end the game after all scheduled rounds are completed.

### R-021 — Result

The system shall display the final scores and winning team to every player.

## Real-Time Requirements

### R-022 — State Synchronization

The server shall maintain the authoritative game state.

### R-023 — Real-Time Updates

Player joins, team assignments, card actions, scores, rounds, and game state changes shall be synchronized to connected clients in real time.

### R-024 — Action Validation

The server shall validate gameplay actions before applying them to the game state.

### R-025 — Invalid Actions

The server shall reject actions that are not valid for the current game phase or player role.

## Technical Requirements

### R-026 — Runtime

The complete V0 system shall run on a single Host machine.

### R-027 — Frontend

The client application shall be implemented using Next.js, React, and TypeScript.

### R-028 — Communication

Real-time communication shall use Socket.IO.

### R-029 — Game Engine

Core game rules shall be implemented in a TypeScript game engine independent from UI components.

### R-030 — Persistence

Local persistent data shall use SQLite through Drizzle ORM where persistence is required.

## Quality Requirements

### R-031 — Testability

Core game logic shall be testable without requiring browser interaction.

### R-032 — Unit Testing

Critical game rules and scoring logic shall have automated unit tests.

### R-033 — End-to-End Testing

Critical multiplayer flows shall be covered by Playwright tests.

### R-034 — Responsive UI

The interface shall be usable on phones, tablets, and desktop browsers.

### R-035 — Recovery

A client refresh shall not corrupt the server's authoritative game state.