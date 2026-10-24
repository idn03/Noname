# Noname V0 Remaining Work Plan

**Basis:** Current source and product specifications reviewed 2026-10-24. Product behavior is governed by `specs/`; the former agent-harness lifecycle is not part of this plan.

## Current baseline

The repository has the Next.js/TypeScript and Socket.IO foundation, local SQLite/Drizzle static content, session lifecycle, balanced team assignment, and game setup with prepared session challenge pools. Automated behavioral tests for team setup remain unverified. Card selection, gameplay, scoring, game-level realtime views, and most specified screens remain to be implemented. Existing feature task checklists are unchecked and are not treated as implementation evidence.

## Ordered work

### 1. Complete session lifecycle and engine handoff

Complete name-free Host creation, player admission and reconnect behavior, connected-player start eligibility, confirmed starts for 6–9 players, Host-only cancellation, room deletion, and session credential expiry. Connect the authoritative lobby roster to game state without admitting the Host as a player. Preserve disconnected identities while counting only connected players toward the start minimum. Implement Sandbox room creation alongside regular creation: a three-second hold on TẠO creates a Sandbox room, seeds 6–10 connected simulated players, and rejects real-player joins and resumes through room links.

**Done when:** Host and player identities are server-controlled; lobby boundaries and Host actions are enforced; start passes only eligible connected players to the engine; cancellation and deletion clear the active session and notify clients. A regular click still creates a regular room; a three-second hold creates a Sandbox room with 6–10 simulated players, and real players cannot enter it through join or resume.

**Specs:** [authentication](../../specs/05-features/authentication/requirements.md), [session management](../../specs/05-features/session-management/requirements.md), [authorization](../../specs/04-backend/authorization.md).

### 2. Complete team assignment and game setup

Implement server-side randomized, balanced assignment for 6–10 joining players, excluding the Host. Make validation, assignment, and transition to selection atomic. Prepare the session’s category challenge pools as part of setup and fail safely when required content is invalid or unavailable. Sandbox rooms use the same start validation, team assignment, and setup path as regular rooms.

**Done when:** Every valid regular or Sandbox start produces stable balanced teams and an initialized game; invalid starts leave the lobby unchanged; Sandbox simulated players are assigned through the authoritative engine and the Host remains an observer.

**Specs:** [team assignment](../../specs/05-features/team-assignment/requirements.md), [static game content](../../specs/05-features/static-game-content/requirements.md), [business rules](../../specs/01-product/business-rules.md).

### 3. Implement card selection

Add one personal slot per player, team category access, local editable drafts, server-validated submit/replace/remove, readiness, selection timing, and the all-player completion gate. Provide role-filtered player views and a Host overview with rosters, counts, readiness, and remaining time. In Sandbox, automatically fill every Wolf slot with Music and a random available challenge, and fill Sheep slots with the specified two Music and one Travel defaults.

**Done when:** Only slot owners can change their selections; submitted choices remain private as specified; gameplay begins only after every player submits a complete slot; timer expiry does not bypass the gate. Sandbox defaults are applied to simulated players through normal validated selection actions. Specify how defaults cover Sheep teams larger than three before implementation, since current specifications define 2 Music and 1 Travel while team sizes can reach five.

**Specs:** [card selection](../../specs/05-features/card-selection/requirements.md), [session management](../../specs/05-features/session-management/requirements.md).

### 4. Implement attacks, defenses, and challenge outcomes

Add owner-only Wolf attacks, one active attack, matching unused Sheep defenses, first-valid defense handling, challenge selection without repeats while alternatives remain, and Host-only recording of one challenge outcome. Track card use and round progression in the engine. Keep Sandbox simulated-player actions within the same authorization and engine rules so the mode can exercise gameplay without real-player accounts.

**Done when:** Invalid, stale, duplicate, unauthorized, and wrong-phase actions leave state unchanged; valid actions resolve in order and cannot reuse cards. Sandbox can exercise the implemented turn actions through simulated players without bypassing server validation. Define any simulated-player action policy before this task, since current specifications define setup and selection behavior but not turn behavior.

**Specs:** [turn gameplay](../../specs/05-features/turn-gameplay/requirements.md), [business rules](../../specs/01-product/business-rules.md).

### 5. Implement scoring, results, and Host match controls

Apply authoritative scoring for undefended attacks, successful defenses, and challenge outcomes. End after the configured rounds with correct scores and winner or draw. Add Host match management, round history, cancellation, and replay with retained team assignments. Preserve Sandbox behavior through match completion, cancellation, and replay.

**Done when:** All result states derive from engine state, Host actions are authorized, cancellation returns clients to Home, and replay returns them to selection with teams retained. Sandbox sessions can exercise the same result and Host-control paths.

**Specs:** [scoring and results](../../specs/05-features/scoring-results/requirements.md), [turn gameplay](../../specs/05-features/turn-gameplay/requirements.md), [session management](../../specs/05-features/session-management/requirements.md).

### 6. Complete realtime views, recovery, and user flows

Add typed Socket.IO game commands and updates, connection-bound authorization, safe error responses, role-filtered snapshots, and refresh recovery at every active phase. Implement the specified Home, team rules, lobby, selection, gameplay, Host management, and results flows with responsive layouts and Vietnamese user-facing text. Add end-to-end browser coverage for the Sandbox path as each phase becomes available; Sandbox creation and real-player admission rejection belong to Task 1, not a final-stage implementation.

**Done when:** Connected clients render confirmed server state, unauthorized clients never receive hidden information, refresh restores the current authorized view, and the critical Host/player journey works across phone, tablet, and desktop sizes.

**Sandbox coverage:** The Sandbox path is implemented incrementally alongside Tasks 1–5 and is not a separate final feature stage. Task 1 provides room creation and simulated identities; Task 2 supports authoritative start and team assignment; Task 3 applies automatic selections; Tasks 4–5 support gameplay and results using the same server rules. Task 6 verifies the integrated browser path and role-safe views.

**Specs:** [API contracts](../../specs/04-backend/api-contracts.md), [realtime synchronization](../../specs/05-features/realtime-synchronization/requirements.md), [pages](../../specs/02-ux/pages.md), [application flow](../../specs/02-ux/application-flow.md), [language](../../specs/02-ux/language.md), [testing strategy](../../specs/06-testing/strategy.md).

## Planning notes

- Static content storage, validation, and bounded session-pool preparation already exist; verify their integration with game setup as part of Task 2.
- Session lifecycle, team assignment, and initial game setup are implemented; finish their required behavioral verification before treating their gates as passed.
- Sandbox-specific behavior is defined in [session management](../../specs/05-features/session-management/requirements.md), [application flow](../../specs/02-ux/application-flow.md), and [pages](../../specs/02-ux/pages.md). Keep implementation with the feature that enables each behavior instead of deferring Sandbox creation to Task 6.
- Decide how the Sheep Sandbox selection defaults fill teams with four or five slots, and define the simulated-player action policy for turn gameplay, before implementing Tasks 3–4; current specifications do not settle these details.
- The standalone results component is present; connect it to authoritative results in Task 5.
- Before implementing Host match management, specify what **Hoàn Thành** does and when it is available. The current requirements name the control but do not define its state transition.
- The harness-oriented documents under `specs/` remain in the repository but are intentionally not used as execution requirements for this direct-work plan.
