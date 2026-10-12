# B-003 — Static Game Content

Use this sheet after the full plan is reviewed. The authoritative stage definition
is in [backlog.md](../../../specs/07-planning/backlog.md); workflow gates are in
[workflow.md](../../../specs/workflow.md). Follow `RULES.md` and the stage's
relevant specifications. Do not expand the scope to another backlog stage.

## Stage contract

- **Depends on:** B-001, B-002.
- **Scope:** Add local SQLite and Drizzle schema/migrations for categories and challenges; validate content and prepare a session pool of no more than 10 challenges per category.
- **Complete when:** Local content can be loaded through Drizzle, invalid data fails safely, and subset selection is bounded and testable.

## Run prompt

Run the Coordinator workflow for this backlog stage:

```bash
bash scripts/implement-feature.sh "B-003 — Static Game Content"
```

The script starts the configured provider in this repository and asks the
Coordinator to use the roles in `agents/` for implementation, review, testing,
validation, bounded repairs, and checkpointing. Set `NONAME_PROVIDER=opencode`
before the command to select OpenCode; Codex is the default. The Coordinator
must halt for plan approval when needed and cannot checkpoint without passing
gate evidence.

## Phase prompts

1. **Implement:** Ask the implementer to make the smallest complete change for
   this stage, respecting contracts and existing patterns. Report paths changed,
   commands run, and unresolved specification gaps.
2. **Review:** Ask the read-only reviewer to compare the diff with this stage,
   `RULES.md`, and relevant specs. Require pass/fail, severity, file/line
   findings, and evidence. Do not accept claims without evidence.
3. **Test:** Ask the tester to create/run behavior tests for the completion
   criteria. Require commands, exit status, covered behavior, and failures.
4. **Validate:** Ask the read-only validator to check review/test outcomes and
   configured lint, type, build, and other required quality checks. Require
   executed results; skipped or unavailable checks do not pass.
5. **Repair:** On review, test, or validation failure, send only the relevant
   findings to the responsible role. Track each attempt and outcome. Stop when
   the configured per-stage/per-failure-class repair limit is exhausted.
6. **Checkpoint:** After all gates pass, create a stage-identifying git
   checkpoint. If checkpointing fails, halt and retain resumable state.

## Checklist

- [x] Plan and dependencies verified; this stage retains its original ID/order.
- [x] Relevant specs and repository rules were read before edits.
- [x] Implementation stayed within the stage scope.
- [ ] Review passed with no critical or major findings.
- [x] Focused and full unit tests passed.
- [ ] Configured validation checks passed; typecheck is blocked by unavailable Drizzle packages.
- [x] Three repair cycles and outcomes are recorded; repair budget was not exceeded.
- [x] Completion checkpoint is withheld until all gates pass.
- [x] Halted at B-003; no dependent stage was attempted.

## Current run status

**Still blocked after Cycle 3.** The full test suite and production build pass,
but typecheck fails because `drizzle-orm` and `@libsql/client` could not be
installed (`ENOTFOUND registry.npmjs.org`). `package-lock.json` remains out of
sync with `package.json`, and Drizzle migration/seed/load behavior has no
executed integration evidence. A resumption attempt retried installation and
the configured checks but hit the same registry failure. See
`docs/temps/20261012T093402Z-b003-static-game-content-run.md` for cycle history,
resumption evidence, and the next action. No completion checkpoint was created;
the full plan stops here.

## Completion evidence

Record the implementation, review, test, validation, repair, and checkpoint
results in the run record. The completion criterion is: Local content can be loaded through Drizzle, invalid data fails safely, and subset selection is bounded and testable.
