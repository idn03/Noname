# B-001 Application Foundation — Run Record

- **Run status:** halted, resumable
- **Plan:** original approved B-001 → B-010 order; unchanged
- **Stage:** B-001, first in plan; no dependencies
- **Completed:** 0/10 stages; B-001 gates remain incomplete
- **Later stages attempted:** none
- **Memory:** `specs/memory.md` is policy only; no implementation memory found

## Stage result

The foundation scaffold is present and remains within B-001 scope. The stage
was resumed after dependencies were installed. Review passed after two bounded
configuration repairs, and a Vitest rendering smoke test was added. Typecheck,
build, unit test, and diff checks pass. Host startup and Playwright E2E cannot
bind to loopback in this environment (`EPERM`), so required runtime evidence is
unavailable. B-001 is halted and resumable; it was not checkpointed. The
original plan order is unchanged.

## Current gate evidence

| Phase/check | Result | Evidence |
| --- | --- | --- |
| Implement | Pass | Existing TypeScript/Next/React/Tailwind/Zustand/Socket.IO scaffold, responsibility directories, Node Host integration, and test tooling. Implementer found no source changes necessary. |
| Review | Pass | Read-only reviews passed after the Vitest discovery repair and Node import-hook startup repair; no critical or major findings. |
| Test: `TMPDIR=/tmp npm test` | Pass | Exit 0; one Vitest file and one server-rendered home-page heading test. |
| Test: `HOST=127.0.0.1 TMPDIR=/tmp npm run test:e2e` | Unavailable; fail gate | Exit 1; Playwright web server could not bind `127.0.0.1:3000` (`EPERM`), so browser assertions did not run. |
| Validate: `HOST=127.0.0.1 TMPDIR=/tmp npm run typecheck` | Pass | Exit 0. Validator reran typecheck successfully. |
| Validate: `HOST=127.0.0.1 TMPDIR=/tmp npm run build` | Pass | Exit 0; Next production build and static generation completed. |
| Validate: `npm run lint` | Not configured | No lint script exists; not counted as pass. |
| Startup: `HOST=127.0.0.1 TMPDIR=/tmp npm run dev` | Unavailable; fail gate | Exit 1; bind to loopback was denied (`EPERM`). Process stopped. |
| Repository hygiene: `git diff --check` | Pass | Exit 0; validator reran successfully. |
| Checkpoint | Not attempted | Host startup and E2E gates did not pass. |
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

The E2E and startup failures persist after setting `TMPDIR=/tmp` and
`HOST=127.0.0.1`. Direct `node --import tsx backend/server.ts` also could not
bind the configured private address (`EPERM`). This environment restriction
leaves required Host/browser evidence unavailable; it is not a pass. No repair
attempt remains authorized or effective within this environment, so the run
halts here and can resume with the original plan in an environment that permits
local Host binding.

## Changed paths

- `package.json` — use Node's tsx import hook for `dev` and `start`.
- `vitest.config.ts` — preserve default excludes and keep Playwright specs out
  of Vitest discovery.
- `tests/application-home.test.tsx` — verify the browser app home heading
  renders.
