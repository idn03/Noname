# B-004 Player Identity and Lobby — Run Record

- **Run status:** Blocked after Cycle 3; source review, automated tests, typecheck, and production build pass. Required Playwright CLI browser gate is unavailable. Recovery checkpoint only; no completion checkpoint created.
- **Plan:** Reused the reviewed B-001 → B-010 backlog plan unchanged; B-004 retains its ID, dependencies, scope, and order.
- **Dependencies:** B-001 and B-002 completion checkpoints are recorded in prior stage run records; B-003 completion checkpoint `24e884d` is present.
- **Stage:** B-004; incomplete; no dependent stage attempted.
- **Memory:** `specs/memory.md` contains policy only; no active implementation decisions, notes, or progress entries were found.
- **Design Read:** Reading this as a Vietnamese local-multiplayer lobby interface for players on phones and desktops, with clear, accessible game-state presentation, leaning on the existing monochrome and blood-red design system. Dials: `DESIGN_VARIANCE 4 / MOTION_INTENSITY 2 / VISUAL_DENSITY 4`.
- **Host bootstrap:** Resolved by `specs/05-features/authentication/requirements.md` ID-012 and the authentication flow: the local server runner presses PLAY and receives the server-assigned Host identity.

## Cycle results

| Cycle | Implementation and independent review | Focused checks | Browser UI evidence | Outcome |
| --- | --- | --- | --- | --- |
| 1 | Implemented lobby identity primitives, Socket.IO transport, and Vietnamese join/lobby UI. Independent review failed: `activeLobby` is never initialized, so all join attempts return `NO_ACTIVE_SESSION`; no credential expiry lifecycle exists. Minor finding: pending UI join state has no timeout/disconnect recovery. | `npx vitest run tests/lobby-session.test.ts` — pass, 1 file / 5 tests. Tests cover display-name normalization/validation, duplicate names, capacity, reconnect, and rejected-join immutability. `npm run typecheck` and `git diff --check` — pass. | **Unavailable.** `npx playwright-cli open http://127.0.0.1:3000` could not create its daemon directory in the restricted home cache. With `PWTEST_DAEMON_SESSION_DIR=/private/tmp/noname-playwright-daemon`, the default Chrome channel was absent. A temporary `/private/tmp/noname-playwright-cli.config.json` pointed at the cached Chromium binary, but browser launch exited with `SIGABRT`/`EPERM`; `npm run dev` also failed to bind `192.168.1.25:3000` (`listen EPERM`). No snapshot, screenshot, console/request inspection, or interaction artifact was produced. | Failed; Host bootstrap and browser evidence remain outstanding. |

## Gate evidence

| Gate | Command or source | Result |
| --- | --- | --- |
| Review | Independent source review of changed B-004 code | Fail: active lobby is never initialized; credentials have no expiry lifecycle. Minor pending join state has no timeout/disconnect recovery. |
| Typecheck | `npm run typecheck` | Pass, exit 0. |
| Diff hygiene | `git diff --check` | Pass, exit 0. |
| Focused tests | `npx vitest run tests/lobby-session.test.ts` | Pass, exit 0; 1 file / 5 tests. Transport/browser acceptance is not covered. |
| Browser review | `npx playwright-cli open http://127.0.0.1:3000`; retries with `PWTEST_DAEMON_SESSION_DIR=/private/tmp/noname-playwright-daemon` and cached Chromium config, against `HOST=127.0.0.1 PORT=3001 npm run dev` | Unavailable: the CLI cache location was blocked, then the expected browser build was absent; explicit cached-browser launch exited `SIGABRT`/`EPERM`; application listen failed with `EPERM` on both the detected LAN address and loopback. No snapshot, screenshot, console/request inspection, interaction, or browser artifact could be produced. This required gate is not a pass. |

## Changed paths

`backend/lobby-session.ts`, `backend/lobby-transport.ts`, `backend/server.ts`, `shared/lobby-contract.ts`, `web-game/features/lobby/LobbyScreen.tsx`, `web-game/app/page.tsx`, `web-game/app/globals.css`, `web-game/app/layout.tsx`.

## Halt / resumption

**Initial halt:** Cycle 1 originally halted on a misread Host bootstrap gap and unavailable browser evidence. Cycle 2 source review clarified that the product explicitly creates the Host session on local PLAY; that implementation was verified and repaired as needed in later cycles. The final halt cause and resumption state are recorded below.

## Cycle 2

- **Implementation:** Rotated credentials on resume, emitted refreshed credentials through the shared event, and added visible disconnect and stale-credential handling. Host bootstrap was verified against the explicit local PLAY rule: it creates `activeLobby` and assigns the server-side Host identity.
- **Focused checks:** `npx vitest run tests/lobby-session.test.ts` — pass, 1 file / 5 tests; `npm run typecheck` — pass; `git diff --check` — pass.
- **Independent review:** Fail. Major findings: late-arriving LAN clients received no active lobby snapshot and could not reach Join; invalid handshake credentials were silently ignored; repeated joins on one socket could orphan a connected identity.
- **Full validation:** `npm test` — fail, 4/5 files pass, 20/21 tests; stale `tests/application-home.test.tsx` expected the former `Noname` heading. The failed full validation consumed Cycle 3.
- **Browser review:** Unavailable. `npx playwright-cli open http://127.0.0.1:3000` failed with `EPERM` creating the default daemon directory. Retrying with `PWTEST_DAEMON_SESSION_DIR=/private/tmp/noname-playwright-daemon` failed because Chrome was not installed at the configured path. No snapshot, screenshots, console/request inspection, or interaction evidence was produced.

## Cycle 3

- **Implementation repairs:** New sockets receive the active public lobby snapshot; invalid handshake credentials receive a safe error while the join path remains available; already-bound sockets cannot create, join, or resume a second identity. Invalid-credential guidance survives the lobby snapshot and is visible in both open and started lobbies.
- **Tester repairs:** Updated the stale home-page heading assertion. Added mocked transport checks for active lobby snapshots, invalid handshake credentials, and duplicate join rejection. A real Socket.IO test attempt could not bind due to sandbox `listen EPERM`, so handler-level mocked tests were used.
- **Focused checks:** `npx vitest run tests/lobby-session.test.ts tests/lobby-transport.test.ts tests/application-home.test.tsx` — pass, 3 files / 8 tests.
- **Independent review:** Source review passed after the final UI feedback repair; the three Cycle 2 findings were resolved. Browser UI evidence remains unavailable and is not a pass.
- **Final validation:** `npm test` — pass, 6 files / 23 tests; `npm run typecheck` — pass; `npm run build` — pass; `git diff --check` — pass.

## Blocked status and recovery

**Failed required gate:** Playwright CLI UI review is unavailable in this environment. No snapshot, relevant viewport screenshots, console/request inspection, or user interaction evidence exists. **Remaining acceptance criterion:** execute the B-004 browser review on an environment with a runnable Playwright CLI browser and application server; inspect Host PLAY, LAN join, refresh recovery, responsive viewports, console errors, and failed requests. **Next resume action:** resume this same B-004 stage and original plan, retain Cycle 1–3 findings and test evidence, run the complete required Playwright CLI review, then perform the stage completion checkpoint only if that gate passes. B-005 and later stages remain unattempted.

**Recovery checkpoint:** [20261013T090400Z-b004-recovery-checkpoint.tar.gz](20261013T090400Z-b004-recovery-checkpoint.tar.gz) preserves the changed stage files and this run record; it is temporary and does not satisfy dependencies. A Git recovery commit could not be created because `.git` is read-only in this workspace (`git commit` failed creating `.git/index.lock` with `Operation not permitted`). The working tree remains intact for resumption. Do not mark B-004 complete or start B-005 until browser evidence is available and the required completion checkpoint can be created.
