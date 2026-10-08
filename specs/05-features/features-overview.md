# Feature Overview

Noname V0 is a local multiplayer card game for 6–10 players. The Host runs the application and participates as a player. Players join through browsers on the same LAN or Wi-Fi network. The Host server owns the active session and authoritative game state.

## V0 Features

- **Player identity and lobby:** Players join with a display name, see connected players, and wait for the Host to start. Identity is session-based; V0 has no player accounts.
- **Host session management:** The Host starts a game when the minimum player count is met and can cancel the current session.
- **Team assignment:** Starting the game assigns every player, including the Host, to Wolf or Sheep with balanced team sizes.
- **Card selection:** Both teams fill their card slots before play. Players can edit an unsubmitted draft locally. Done submits the team's complete selection to the Host; a submitted selection can be canceled and chosen again while the Selection Phase remains active. The phase advances when both teams have complete submissions. Wolf can inspect the available challenges during selection; Sheep cannot see Wolf's selected cards before reveal.
- **Turn gameplay:** Wolf attacks with an unused selected card. Sheep may defend with an unused card from the matching category. A challenge may follow a successful defense.
- **Scoring and results:** The server applies the scoring rules, advances the finite set of rounds, and presents the final scores and winner or draw to all players.
- **Realtime synchronization:** The Host server validates player actions and synchronizes lobby and game updates to connected clients. A browser refresh can recover from the running Host session.
- **Static game content:** Categories and predefined challenges provide the content used for card selection and gameplay.

## Feature Specifications

Detailed product behavior and acceptance criteria belong in the relevant documents under `05-features/<feature>/`. Shared game rules are defined in `01-product/business-rules.md`; technical and backend contracts are defined in `03-technical/` and `04-backend/`. This overview summarizes feature areas and does not override those specifications.

## V0 Scope Boundary

V0 is designed for play on a local network with one Host and one active game session. It does not include player accounts, public matchmaking, cloud services, internet-scale deployment, native mobile applications, or durable recovery of a live game after the Host process restarts.
