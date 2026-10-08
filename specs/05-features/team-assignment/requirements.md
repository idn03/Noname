# Team Assignment Requirements

- **TEAM-001 — Complete Assignment:** Assign every connected player, including the Host, to exactly one of Wolf or Sheep when the game starts.
- **TEAM-002 — Balance:** Split an even player count evenly. For an odd count, give one randomly selected team one extra player.
- **TEAM-003 — Valid Size:** Support 6–10 players, producing teams of 3–5 players.
- **TEAM-004 — Randomness:** Use server-side randomness isolated so assignment behavior can be tested with controlled inputs.
- **TEAM-005 — Stability:** Keep assignments unchanged until the game ends or is cancelled.
- **TEAM-006 — Authority:** Clients cannot choose, alter, or report authoritative team assignments.
- **TEAM-007 — Atomic Start:** Do not expose partial assignment if start validation or the transition fails.
