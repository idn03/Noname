# Step 4 Gameplay UI

Design Read: local multiplayer game screens for players and a Host, preserving the supplied heritage card-table language. Dials: variance 6, motion 5, density 4.

Implemented the Host match view and Player gameplay view on authoritative turn snapshots. Player card faces flip to reveal the relevant challenge; attack, defense, and Host outcome actions send round-scoped commands through the existing Socket.IO transport. The Host can inspect round history and cancel the match. Existing engine behavior supplies card-use enforcement, scoring, challenge rotation, round progression, and Sandbox simulated turns.

Verification: `pnpm typecheck` and `git diff --check` passed. Automated tests were not run.

The `Hoàn Thành` control shown in the reference remains unspecified by the turn gameplay contract; the remaining-work plan calls out its behavior for the later Host match-controls stage. The outcome buttons here follow TURN-011 (`Thành Công` / `Thất Bại`).
