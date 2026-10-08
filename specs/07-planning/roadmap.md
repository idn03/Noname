# V0 Roadmap

This roadmap orders work by dependency and player-visible value. It has no calendar estimates; stage size and sequencing should be reviewed as implementation evidence becomes available.

## Sequence

1. **Build the foundation — M-001:** Create the application and testing foundations, then establish the independently testable Game Engine.
2. **Make a game session possible — M-002:** Add local challenge data, player identity and lobby, Host controls, and randomized team setup.
3. **Prepare teams to play — M-003:** Add personal card slots, private selection views, selection editing, and the all-player readiness gate.
4. **Complete the game loop — M-004:** Add owner-controlled attacks, matching defenses, challenges, scoring, and final results.
5. **Prepare for playtesting — M-005:** Harden realtime consistency, privacy, and reconnect behavior, then verify responsive layouts and the complete multi-browser flow.

## Ordering Rules

- Complete each milestone's stages in backlog dependency order; do not start a dependent stage before its prerequisites pass.
- Keep the Game Engine and its unit tests ahead of UI behavior that depends on those rules.
- Build the local challenge catalog before card selection and challenge resolution.
- Use review, required tests, validation, and a checkpoint for every stage as defined in [workflow](../workflow.md).

## V0 Boundary

The roadmap ends with a local-network playtestable release on one Host machine. Cloud services, player accounts, public matchmaking, internet-scale deployment, native apps, and durable recovery after a Host restart remain outside V0.
