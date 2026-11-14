<h1 align="center">
  <img src="web-game/public/assets/splash-image.png" width="600" alt="Wolves and Sheep — a multiplayer card game">
</h1>

<h3 align="center">A team card game for people sharing a local network.</h3>

**Noname** is a turn-based multiplayer game for a group playing together in
person. Players join the Wolves or Sheep, choose cards by category, then take
turns attacking, defending, and completing challenges. One computer hosts and
controls the game; everyone connects from a browser over the same Wi-Fi or LAN.

## How to play

- A game needs **6–10 players**. The Host runs the game and is not included in
  the player count.
- When the Host starts the game, the server randomly balances players between
  the Wolves and Sheep teams.
- Both teams choose cards by category before play begins. Each player manages
  their own card slot.
- Wolves attack with a card. Sheep can defend only with an unused card from the
  same category; the defending player handles the related challenge.
- If Sheep cannot defend, Wolves score **2 points**. A successful defense in
  the matching category scores **1 point** for Sheep. Completing the challenge
  successfully earns Sheep **1 additional point**.
- The game ends after the scheduled rounds. The team with more points wins; a
  tie is a draw.

## Install and play

### Requirements

- Node.js 22 or later
- pnpm 10.32.0
- 6–10 players (excluding the Host) on the same Wi-Fi or LAN, each with a
  browser

### Run on the Host computer

```sh
git clone https://github.com/idn03/Noname.git
cd Noname
pnpm install
pnpm dev
```

On the Host computer, open `http://127.0.0.1:3000` to create a room. Other
players should open the LAN address printed by the server in the terminal, or
the Host computer's private IP address on port `3000`. If players cannot
connect, allow Node.js to accept connections through the local network firewall.

## Development

```sh
pnpm test             # Unit and integration tests
pnpm run typecheck    # TypeScript checks
pnpm run build        # Build the application
pnpm run test:e2e     # Browser tests
```

GitHub Actions runs these checks for pull requests targeting `main` and pushes
to `main`. See [`specs/workflow.md`](specs/workflow.md) for the development
workflow and [`specs/`](specs/) for the full product and gameplay rules.
