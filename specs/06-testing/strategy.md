# Testing Strategy

## Purpose

Verify that the Host and all connected browsers follow the product rules, keep one authoritative game state, and handle invalid actions safely. Prioritize the Game Engine because it owns the gameplay outcomes.

## Test Levels

| Level | Tool | Main responsibility |
| --- | --- | --- |
| Unit | Vitest | Test Game Engine rules and other pure logic without a browser, network, or database. |
| Integration | Vitest | Test application services, Socket.IO boundaries, authorization, persistence, and synchronization together. |
| End-to-end | Playwright | Test critical player and Host journeys through real browser interfaces and realtime communication. |
| Interactive UI review | Playwright CLI | Inspect a stage's browser UI with snapshots, screenshots, console and request output, and relevant interactions during each implementation/review cycle. |

## Coverage Priorities

- **Game Engine:** Test balanced team assignment, player-owned card slots, phase gates, timer expiry, attack and defense ownership, matching categories, card-use rules, challenge selection, scoring, round progression, cancellation, and final results.
- **Backend:** Test join validation, Host-only operations, command validation, rejection without state mutation, role-filtered updates, reconnect behavior, and SQLite content access through Drizzle.
- **Browser flows:** Cover joining and lobby updates, Host start and cancel, team assignment, card selection, attack and defense, Host-recorded challenge outcomes, score updates, final results, refresh recovery, and common phone, tablet, and desktop sizes.

Each feature's `tests.md` lists its expected behaviors. Keep tests behavior-focused and avoid asserting private implementation details.

Playwright CLI inspection supplements automated Playwright Test coverage. It
does not replace deterministic unit, integration, or end-to-end tests. Record
the CLI commands and evidence paths in the stage run record.

## Determinism and Isolation

Inject or control randomness in Game Engine tests. Assert assignment and challenge-pool invariants rather than one arbitrary random result. Keep test database state isolated and reset it between tests. Do not use production player or game data in tests.

## Test Quality

- Test valid behavior and important invalid, stale, unauthorized, and wrong-phase actions.
- Verify failed commands do not partially mutate authoritative state.
- Verify clients receive only information allowed for their identity and team.
- Prefer focused unit and integration tests; reserve browser tests for journeys that cross the interface and realtime boundary.
- Do not introduce a coverage percentage requirement unless the project explicitly defines one.

## Completion

Required checks must pass with recorded test-run evidence. A failed, skipped, missing, or unavailable required check is not a pass. Test failures must be reported and repaired within the bounded workflow; do not hide failures by weakening assertions or omitting required cases.
