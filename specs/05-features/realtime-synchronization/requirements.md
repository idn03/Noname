# Realtime Synchronization Requirements

- **SYNC-001 — Transport:** Use Socket.IO between browsers and the Host over the local network.
- **SYNC-002 — Authority:** The Host server is the source of truth for session, team, card, phase, turn, score, and result state.
- **SYNC-003 — Validation:** Validate every incoming command's shape, identity, permissions, and phase before mutation.
- **SYNC-004 — Consistency:** Publish updates only after a valid authoritative transition succeeds.
- **SYNC-005 — Authorized Views:** Filter snapshots and updates by player permissions; never reveal Wolf selections to Sheep before reveal.
- **SYNC-006 — Recovery:** On refresh or valid reconnect to the running Host, return the player's current authorized state without duplicating identity.
- **SYNC-007 — Disconnect Safety:** A temporary disconnect does not crash the server or corrupt game state; publish presence changes.
- **SYNC-008 — Safe Errors:** Return stable client error codes and safe messages; do not expose raw failures or credentials.
