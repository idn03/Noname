# V0 Backlog

Backlog items are dependency-ordered implementation stages. Each stage has one concern. Completion includes the implementation, review, required tests, validation, and checkpoint defined by [workflow](../workflow.md); a missing or unavailable required check is not a pass.

## Stages

### B-001 — Application Foundation

- **Depends on:** None.
- **Scope:** Establish the planned TypeScript, Next.js, React, Node.js, styling, test, and directory foundations. Confirm the Host can serve the browser application and provide a Socket.IO integration point.
- **Complete when:** The application builds, the test tools run, and the planned responsibility boundaries are in place.

### B-002 — Game Engine Foundation

- **Depends on:** B-001.
- **Scope:** Define authoritative game state, commands, phases, domain errors, and controllable randomness. Keep rules independent from UI, transport, and persistence.
- **Complete when:** Core state transitions can be tested without a browser or database, and invalid commands leave state unchanged.

### B-003 — Static Game Content

- **Depends on:** B-001, B-002.
- **Scope:** Add local SQLite and Drizzle schema/migrations for categories and challenges; validate content and prepare a session pool of no more than 10 challenges per category.
- **Complete when:** Local content can be loaded through Drizzle, invalid data fails safely, and subset selection is bounded and testable.

### B-004 — Player Identity and Lobby

- **Depends on:** B-001, B-002.
- **Scope:** Host observer session creation from the server machine's local browser using TẠO, join by display name, server-issued identities, lobby presence, 10-player capacity excluding Host, disconnect handling, and refresh recovery.
- **Complete when:** The local server runner can create a room as a name-free Host observer; valid players can join and reconnect; remote clients cannot create sessions or claim Host authority; invalid joins are rejected safely.

### B-004.1 — Sandbox Lobby Mode

- **Depends on:** B-004.
- **Scope:** Provide the three-second TẠO hold, populate Sandbox with 6–10 simulated players in addition to the Host, and reject real-player link joins to Sandbox.
- **Complete when:** Sandbox has a valid simulated roster and rejects real-player admission while normal room creation remains available.

### B-005 — Host Controls and Team Assignment

- **Depends on:** B-002, B-004.1.
- **Scope:** Host-only start, low-population confirmation, room deletion, and balanced randomized assignment of joining players only. The Host remains an observer.
- **Complete when:** The Host can start a valid lobby or delete it, and every valid start produces stable, balanced teams of joining players only.

### B-006 — Personal Card Selection

- **Depends on:** B-003, B-005.
- **Scope:** One personal slot per player, local drafts, server-validated submit/replace/remove, role-filtered selection views, timer, and all-player completion gate.
- **Complete when:** Every player can submit a valid slot, the phase advances only when all are complete, and timer expiry keeps incomplete selection open.

### B-006.1 — Host Selection Overview

- **Depends on:** B-006.
- **Scope:** Give the Host a read-only overview of both team rosters, selected-card counts, readiness, and remaining selection time without a Host card slot.
- **Complete when:** Host selection view tracks authoritative team and selection progress while all player card choices remain private as specified.

### B-006.2 — Sandbox Card Defaults

- **Depends on:** B-006.1, B-004.1.
- **Scope:** Automatically select Music for each Wolf slot with one random available challenge, and select two Music cards and one Travel card for Sheep in Sandbox.
- **Complete when:** Sandbox defaults are applied to the intended simulated player slots and selection state remains consistent with the all-player completion gate.

### B-007 — Attack, Defense, and Challenges

- **Depends on:** B-003, B-006.2.
- **Scope:** Owner-only Wolf card reveal, one active attack, matching personal Sheep defense, first-valid defense handling, challenge presentation, and Host-recorded challenge outcomes.
- **Complete when:** Valid turns resolve in order, invalid or duplicate actions do not mutate state, and used cards cannot be reused.

### B-008 — Scoring and Results

- **Depends on:** B-007.
- **Scope:** Apply the specified score events, advance the configured rounds, and produce the final winner or draw.
- **Complete when:** All scoring outcomes and final results are correct and synchronized from server-authoritative state.

### B-008.1 — Host Match Management

- **Depends on:** B-008.
- **Scope:** Add the Host-only ManageGameScreen, current-round and Wolf attack-card view, Hoàn Thành and X controls, round-by-round text history, match cancellation to HomeScreen, and replay with unchanged teams back to selection.
- **Complete when:** Host actions and history reflect authoritative match state; cancellation and replay synchronize the required destinations and retained team assignments.

### B-009 — Realtime Reliability and Privacy

- **Depends on:** B-001 through B-008.1.
- **Scope:** Complete role-filtered realtime updates, safe errors, disconnect handling, and refresh recovery across the implemented features.
- **Complete when:** Connected clients receive consistent authorized state; invalid commands leave state unchanged; refresh restores the current session.

### B-010 — Browser Acceptance

- **Depends on:** B-009.
- **Scope:** Verify the complete Host-and-player browser journey, critical feature flows, and responsive layouts.
- **Complete when:** Required end-to-end flows pass on common phone, tablet, and desktop sizes and the project quality checks pass.
