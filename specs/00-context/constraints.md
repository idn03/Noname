# Project Constraints

## Purpose

This document defines the technical, product, gameplay, and operational constraints for Version 0 of Noname.

All V0 implementations should remain within these constraints unless a specification explicitly overrides them.

## Deployment Constraints

- The application must run primarily on a single Host machine.
- The Host machine must run the web application, game server, game engine, and database.
- Players must connect through the same LAN or Wi-Fi network.
- V0 must not depend on public Internet deployment.
- V0 must not require cloud infrastructure.
- The Host must also be allowed to participate as a normal player.

## Player Constraints

- A game must support between 6 and 10 players.
- All players must belong to exactly one team after team assignment.
- The available teams are Wolf and Sheep.
- Team assignment must occur automatically when the Host starts the game.
- Team assignment must be randomized.
- The Host must be included in team assignment.
- A player must not belong to both teams simultaneously.

## Session Constraints

- Only one active game session is required for V0.
- The Host must control when the game starts.
- The Host must be able to cancel the current game.
- Players joining before the game starts must enter the lobby.
- Session state must be shared consistently between connected clients.
- Clients must not independently determine authoritative game results.

## Gameplay Constraints

- Gameplay must be turn-based.
- The Wolf team acts as the attacking team.
- The Sheep team acts as the defending team.
- Cards must belong to a card category.
- Defense depends on matching the category of an attacking card.
- The number of gameplay turns must be finite and determined before the turn phase begins.
- Scores must be calculated by the game server.
- The winner must be determined from the final team scores.

Detailed scoring rules belong to the gameplay specification.

## Architecture Constraints

- TypeScript must be used for game logic.
- Socket.IO must be used for real-time client-server communication in V0.
- SQLite must be used as the local database.
- Drizzle ORM must be used for database access.
- Zustand may be used for frontend client state.
- Server-authoritative game state must not depend on Zustand.
- Core game rules must remain independent from UI components.

## Frontend Constraints

- The frontend must use Next.js and React.
- UI components should use Tailwind CSS and shadcn/ui where appropriate.
- The interface must support common phone, tablet, and desktop browser sizes.
- UI implementation must prioritize clarity over animation or visual complexity.
- V0 must not require a dedicated game engine.

## Networking Constraints

- Real-time synchronization must operate through the local network.
- Clients must communicate with the Host machine rather than directly with each other.
- The Host server must be the authoritative source of shared game state.
- Client-side state must not be trusted for score calculation or game progression.
- Temporary client disconnection must not corrupt server game state.

## Data Constraints

- Persistent data must remain local to the Host machine.
- No external database service is required.
- V0 must not require player accounts.
- Player identity may be session-based.
- Game state and static challenge data should be modeled separately where practical.

## 10. Quality Constraints

- Core game logic must be testable independently from the UI.
- Important game-state transitions must have automated tests.
- Invalid state transitions must be rejected by the server.
- Multiplayer events should use explicitly defined payload structures.
- Game behavior should be deterministic where randomness is not required.

## Scope Constraints

V0 should avoid introducing:

- Cloud authentication.
- Public matchmaking.
- Internet-scale deployment.
- Microservices.
- Native mobile applications.
- Complex animation systems.
- Advanced V2 card modifiers.
- Infrastructure that does not directly support the core game loop.