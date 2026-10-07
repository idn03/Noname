# Project Overview

## Project Summary

Noname is a web-based multiplayer board game designed for small groups playing together in the same physical location.

The game combines:

- Turn-based card gameplay.
- Two-team competitive mechanics.
- Truth-or-Dare-style challenges.
- Card category prediction and counter-play.
- A dark, horror-inspired visual theme.

The initial version focuses on validating the core gameplay rather than producing a production-ready online game.

## V0 Goals

Version 0 aims to provide a complete playable game loop that can be tested with real players.

The primary goals are:

- Allow multiple players to join the same game over a LAN or Wi-Fi network.
- Allow the Host to manage the game session.
- Automatically divide players into two teams.
- Allow both teams to select cards before gameplay begins.
- Execute attack and defense mechanics across multiple turns.
- Display challenges associated with played cards.
- Calculate team scores.
- Determine the winner after all turns are completed.
- Synchronize game state across all connected clients.
- Provide enough stability for repeated gameplay testing.

## Player Model

The game contains two teams:

- Wolf.
- Sheep.

The Host is also a normal player and participates in team assignment.

The target player count for V0 is:

- Minimum: 6 players.
- Maximum: 10 players.
- Expected team size: 3 to 5 players.

Teams are automatically assigned when the Host starts the game.

## Core Game Loop

A game session follows this high-level sequence:

1. Players join the Host's game.
2. Players wait in the lobby.
3. The Host starts the game.
4. Players are randomly assigned to Wolf or Sheep.
5. Both teams enter the card selection phase.
6. The game enters the turn phase.
7. Wolf plays an attack card.
8. Sheep attempts to defend with a matching card category.
9. A challenge may be performed.
10. Scores are updated.
11. The next turn begins.
12. The game ends after all configured turns.
13. The team with the highest score wins.

Detailed scoring and card behavior are defined in separate gameplay specifications.

## Deployment Model

V0 is designed for local play only.

All application components run on the Host machine:

- Web application.
- Game server.
- Game engine.
- Database.

Players connect to the Host through the same LAN or Wi-Fi network using a web browser.

Internet deployment is not required for V0.

## Technical Direction

The planned technology stack is:

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.
- Zustand.
- Node.js.
- Socket.IO.
- SQLite.
- Drizzle ORM.
- Vitest.
- Playwright.

The game logic is implemented using a custom TypeScript game engine.

## V0 Priorities

Development priorities are:

1. Correct game logic.
2. Reliable multiplayer synchronization.
3. Stability.
4. Testability.
5. Clear basic user experience.

Visual polish is intentionally secondary during V0 development.

## Out of Scope

The following features are outside the initial V0 scope.