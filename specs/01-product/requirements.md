# Requirements

## Product Requirements

- **R-001 — Local Multiplayer:** Allow multiple players to join a game hosted on the same LAN or Wi-Fi network.
- **R-002 — Player Capacity:** Support 6–10 active players per session.
- **R-003 — Player Identity:** Let players enter a display name before joining.
- **R-004 — Host:** Designate the machine running the server as Host.
- **R-005 — Lobby:** Show connected players before the game starts.
- **R-006 — Start Game:** Let the Host start when at least 6 players are connected.
- **R-007 — Cancel Game:** Let the Host cancel an active game.
- **R-008 — Team Assignment:** Randomly divide all players, including the Host, into Wolf and Sheep teams.
- **R-009 — Balanced Teams:** Keep team sizes as balanced as possible.
- **R-010 — Card Categories:** Provide multiple categories containing predefined challenges.
- **R-011 — Challenge Pool:** Randomly select up to 10 challenges per available category for each session.
- **R-012 — Card Selection:** Let each player select and manage the card in their personal team slot before gameplay.
- **R-013 — Selection Timer:** Set selection time in minutes equal to the number of card slots.
- **R-014 — Wolf Information:** Let Wolf players view available challenges during selection.
- **R-015 — Hidden Information:** Hide Wolf's selected cards from Sheep until revealed.
- **R-016 — Attack:** Let only the player who selected a card reveal it, with at most one active attack at a time.
- **R-017 — Defense:** Let a Sheep player defend an attack using an unused matching-category card from their own slot and handle its corresponding challenge.
- **R-018 — Challenge:** Show the challenge associated with the attacking card's category.
- **R-019 — Scoring:** Calculate scores according to the business rules.
- **R-020 — Game Completion:** End after all scheduled rounds.
- **R-021 — Result:** Show final scores and the winning team to every player.

## Real-Time Requirements

- **R-022 — State Synchronization:** The server maintains authoritative game state.
- **R-023 — Real-Time Updates:** Synchronize joins, teams, card actions, scores, rounds, and state changes to connected clients.
- **R-024 — Action Validation:** Validate gameplay actions before applying them.
- **R-025 — Invalid Actions:** Reject actions invalid for the current phase or player role.

## Technical Requirements

- **R-026 — Runtime:** Run the complete V0 system on one Host machine.
- **R-027 — Frontend:** Use Next.js, React, and TypeScript.
- **R-028 — Communication:** Use Socket.IO for real-time communication.
- **R-029 — Game Engine:** Implement core rules in a TypeScript engine independent of UI components.
- **R-030 — Persistence:** Use SQLite through Drizzle ORM where persistence is required.

## Quality Requirements

- **R-031 — Testability:** Test core game logic without browser interaction.
- **R-032 — Unit Testing:** Automate unit tests for critical game rules and scoring.
- **R-033 — End-to-End Testing:** Cover critical multiplayer flows with Playwright.
- **R-034 — Responsive UI:** Support phone, tablet, and desktop browsers.
- **R-035 — Recovery:** A client refresh must not corrupt authoritative server state.
