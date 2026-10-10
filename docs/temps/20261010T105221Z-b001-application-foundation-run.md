# B-001 Application Foundation — Run Record

- **Run status:** B-001 checkpointed; plan resumable at B-002
- **Plan:** original approved B-001 → B-010 order; unchanged
- **Stage:** B-001, first in plan; no dependencies
- **Completed:** 1/10 stages; B-001 complete
- **Later stages attempted:** none
- **Memory:** `specs/memory.md` is policy only; no implementation memory found

## Stage result

The foundation scaffold is present and remains within B-001 scope. Review
passed after bounded configuration repairs, and a Vitest rendering smoke test
was added. The latest recheck passed unit test, E2E, typecheck, and build.
Playwright started the Host on loopback and verified the home page. B-001 was
checkpointed after the required gates passed; the original plan order is
unchanged and the remaining plan continues at B-002.

## Current gate evidence

| Phase/check | Result | Evidence |
| --- | --- | --- |
| Implement | Pass | Existing TypeScript/Next/React/Tailwind/Zustand/Socket.IO scaffold, responsibility directories, Node Host integration, and test tooling. Implementer found no source changes necessary. |
| Review | Pass | Read-only reviews passed after the Vitest discovery repair and Node import-hook startup repair; no critical or major findings. |
| Test: `TMPDIR=/tmp npm test` | Pass | Exit 0; one Vitest file and one server-rendered home-page heading test. |
| Test: `HOST=127.0.0.1 npm run test:e2e` | Pass | Exit 0; Playwright started the Host and verified the Noname home page. |
| Validate: `npm run typecheck` | Pass | Exit 0. |
| Validate: `npm run build` | Pass | Exit 0; Next production build and static generation completed. |
| Validate: `npm run lint` | Not configured | No lint script exists; not counted as pass. |
| Startup | Pass | Playwright `webServer` started `npm run dev` on `127.0.0.1:3000`; the E2E request succeeded. |
| Repository hygiene: `git diff --check` | Pass | Exit 0; validator reran successfully. |
| Checkpoint | Pass | Commit `4428bd9` (`checkpoint: complete B-001 application foundation`) created after all required gates passed. |
| Archive | Not attempted | Full B-001 → B-010 plan did not complete. |

## Repair history

Earlier implementation repaired Host interface selection twice after review
found wildcard/loopback binding defects, then removed Vitest's empty-suite
success option. The initial run halted because dependencies were unavailable;
afterward `npm install --no-audit --no-fund` succeeded and added 117 packages.

On resumption:

1. Reviewer passed the existing implementation. Tester found Vitest collected
   the Playwright spec. Repair 1 excluded `tests/e2e/**`; review found that this
   replaced Vitest's default excludes.
2. Repair 2 merged the E2E exclusion with `configDefaults.exclude`; review
   passed. The subsequent Vitest run correctly reported no test files.
3. Repair 3 changed `dev` and `start` to use `node --import tsx`, avoiding the
   tsx CLI IPC pipe error. Review passed. Tester added
   `tests/application-home.test.tsx`, and the Vitest run passed.

Earlier E2E and startup attempts were blocked by environment binding
restrictions and a missing Chromium binary. After Chromium was installed, E2E
passed outside the sandbox with `HOST=127.0.0.1`; no source repair was needed
for that environment-only failure. The three focused repairs on resumption and
the earlier repairs are recorded with their outcomes; the bounded repair
process ended without a budget overrun.

## Changed paths

- `package.json` — use Node's tsx import hook for `dev` and `start`.
- `vitest.config.ts` — preserve default excludes and keep Playwright specs out
  of Vitest discovery.
- `tests/application-home.test.tsx` — verify the browser app home heading
  renders.
