# V0 Milestones

Milestones describe observable outcomes, not calendar dates. They are completed only when their listed backlog stages pass the workflow gates and are checkpointed.

## M-001 — Buildable Foundation

- **Stages:** B-001, B-002.
- **Outcome:** The application foundation exists and the Game Engine can validate core transitions independently.
- **Acceptance:** The app builds; domain tests cover valid and invalid transitions; the UI, transport, engine, and persistence boundaries are defined.

## M-002 — Host Lobby and Game Setup

- **Stages:** B-003, B-004, B-005.
- **Outcome:** Players join a local Host lobby, the Host starts or cancels a session, and teams are assigned.
- **Acceptance:** Capacity and Host permissions are enforced; reconnect restores identity; valid starts create balanced teams; challenge content is available locally.

## M-003 — Ready-to-Play Selection

- **Stages:** B-006.
- **Outcome:** Every player selects and submits a personal card slot.
- **Acceptance:** Slot ownership, edit/removal, privacy, timer behavior, and the all-player completion gate match the specifications.

## M-004 — Complete Game Loop

- **Stages:** B-007, B-008.
- **Outcome:** Players complete attacks, defenses, challenges, scoring, and final results.
- **Acceptance:** Card ownership and use are enforced; the Host records challenge outcomes; scores, rounds, winner, and draw are correct.

## M-005 — V0 Playtest Ready

- **Stages:** B-009, B-010.
- **Outcome:** The complete local multiplayer game is ready for repeated playtests.
- **Acceptance:** Critical multi-browser flows, reconnect behavior, privacy, safe errors, responsive layouts, and required quality checks pass.
