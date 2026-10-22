# Noname V0 Remaining Work Plan

**Basis:** Current source and product specifications reviewed 2026-10-22. Product behavior is governed by `specs/`; the former agent-harness lifecycle is not part of this plan.

## Current baseline

The repository has the Next.js/TypeScript and Socket.IO foundation, a partial pure game engine, local SQLite/Drizzle static content, and a basic lobby with identity, join, presence, and refresh recovery. The application does not yet connect lobby operations to game phases. Selection, gameplay, scoring, game-level realtime views, and most specified screens remain to be implemented. Existing feature task checklists are unchecked and are not treated as implementation evidence.

## Ordered work

### 1. Complete session lifecycle and engine handoff

Implement name-free Host creation, player admission and reconnect behavior, connected-player start eligibility, confirmed starts for 6–9 players, Host-only cancellation, room deletion, and session credential expiry. Connect the authoritative lobby roster to game state without admitting the Host as a player. Preserve disconnected identities while counting only connected players toward the start minimum.

**Done when:** Host and player identities are server-controlled; lobby boundaries and Host actions are enforced; start passes only eligible connected players to the engine; cancellation and deletion clear the active session and notify clients.

**Specs:** [authentication](../../specs/05-features/authentication/requirements.md), [session management](../../specs/05-features/session-management/requirements.md), [authorization](../../specs/04-backend/authorization.md).

### 2. Complete team assignment and game setup

Implement server-side randomized, balanced assignment for 6–10 joining players, excluding the Host. Make validation, assignment, and transition to selection atomic. Prepare the session’s category challenge pools as part of setup and fail safely when required content is invalid or unavailable.

**Done when:** Every valid start produces stable balanced teams and an initialized game; invalid starts leave the lobby unchanged.

**Specs:** [team assignment](../../specs/05-features/team-assignment/requirements.md), [static game content](../../specs/05-features/static-game-content/requirements.md), [business rules](../../specs/01-product/business-rules.md).

### 3. Implement card selection

Add one personal slot per player, team category access, local editable drafts, server-validated submit/replace/remove, readiness, selection timing, and the all-player completion gate. Provide role-filtered player views and a Host overview with rosters, counts, readiness, and remaining time. Add the specified Sandbox selection defaults.

**Done when:** Only slot owners can change their selections; submitted choices remain private as specified; gameplay begins only after every player submits a complete slot; timer expiry does not bypass the gate.

**Specs:** [card selection](../../specs/05-features/card-selection/requirements.md), [session management](../../specs/05-features/session-management/requirements.md).

### 4. Implement attacks, defenses, and challenge outcomes

Add owner-only Wolf attacks, one active attack, matching unused Sheep defenses, first-valid defense handling, challenge selection without repeats while alternatives remain, and Host-only recording of one challenge outcome. Track card use and round progression in the engine.

**Done when:** Invalid, stale, duplicate, unauthorized, and wrong-phase actions leave state unchanged; valid actions resolve in order and cannot reuse cards.

**Specs:** [turn gameplay](../../specs/05-features/turn-gameplay/requirements.md), [business rules](../../specs/01-product/business-rules.md).

### 5. Implement scoring, results, and Host match controls

Apply authoritative scoring for undefended attacks, successful defenses, and challenge outcomes. End after the configured rounds with correct scores and winner or draw. Add Host match management, round history, cancellation, and replay with retained team assignments.

**Done when:** All result states derive from engine state, Host actions are authorized, cancellation returns clients to Home, and replay returns them to selection with teams retained.

**Specs:** [scoring and results](../../specs/05-features/scoring-results/requirements.md), [turn gameplay](../../specs/05-features/turn-gameplay/requirements.md), [session management](../../specs/05-features/session-management/requirements.md).

### 6. Complete realtime views, recovery, and user flows

Add typed Socket.IO game commands and updates, connection-bound authorization, safe error responses, role-filtered snapshots, and refresh recovery at every active phase. Implement the specified Home, team rules, lobby, selection, gameplay, Host management, and results flows with responsive layouts and Vietnamese user-facing text. Include Sandbox creation and real-player admission rejection.

**Done when:** Connected clients render confirmed server state, unauthorized clients never receive hidden information, refresh restores the current authorized view, and the critical Host/player journey works across phone, tablet, and desktop sizes.

**Specs:** [API contracts](../../specs/04-backend/api-contracts.md), [realtime synchronization](../../specs/05-features/realtime-synchronization/requirements.md), [pages](../../specs/02-ux/pages.md), [application flow](../../specs/02-ux/application-flow.md), [language](../../specs/02-ux/language.md), [testing strategy](../../specs/06-testing/strategy.md).

## Planning notes

- Static content storage, validation, and bounded session-pool preparation already exist; verify their integration with game setup as part of Task 2.
- The standalone results component is present; connect it to authoritative results in Task 5.
- Before implementing Host match management, specify what **Hoàn Thành** does and when it is available. The current requirements name the control but do not define its state transition.
- The harness-oriented documents under `specs/` remain in the repository but are intentionally not used as execution requirements for this direct-work plan.
