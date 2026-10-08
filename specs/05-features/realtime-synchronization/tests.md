# Realtime Synchronization Tests

## Unit and Integration Coverage

- Valid commands publish updates only after the authoritative transition succeeds.
- Malformed, unauthorized, stale, and wrong-phase commands do not mutate state.
- Each player receives the current authorized snapshot after connect or refresh.
- Sheep updates do not contain hidden Wolf card selections before reveal.
- Disconnects update presence without corrupting game state; valid reconnect restores the same identity.
- Client-facing errors use stable codes and omit credentials, raw errors, and internal details.

## Browser Flow Coverage

- Multiple clients see synchronized lobby, phase, card, score, and result changes.
- Refresh restores current state without changing team, selection, turn, or score.
- A rejected command leaves all clients on the same authoritative state.
