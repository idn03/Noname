# B-003 — Static Game Content

Use this sheet after the full plan is reviewed. The authoritative stage definition
is in [backlog.md](../../../specs/07-planning/backlog.md); workflow gates are in
[workflow.md](../../../specs/workflow.md). Follow `RULES.md` and the stage's
relevant specifications. Do not expand the scope to another backlog stage.

## Stage contract

- **Depends on:** B-001, B-002.
- **Scope:** Add local SQLite and Drizzle schema/migrations for categories and challenges; validate content and prepare a session pool of no more than 10 challenges per category.
- **Complete when:** Local content can be loaded through Drizzle, invalid data fails safely, and subset selection is bounded and testable.

## Runner prompt

> Execute `B-003` from the approved original plan in this repository. First
> confirm its dependencies have passing checkpoints. Read `RULES.md`, this
> stage in `specs/07-planning/backlog.md`, `specs/workflow.md`, and all relevant
> feature/technical specifications. Keep provider-specific behavior in the
> adapter. Perform the following phases in order, returning structured results
> and evidence for each. Implement only this stage's scope. Do not start later
> stages. Follow bounded repair and halt/resume rules. Checkpoint only after
> every required gate passes.

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

- [ ] Plan and dependencies are verified; this stage retains its original ID/order.
- [ ] Relevant specs and repository rules were read before edits.
- [ ] Implementation stayed within the scope above and reports changed paths.
- [ ] Review passed with no critical or major findings.
- [ ] Required tests passed with command and exit-status evidence.
- [ ] Configured validation checks passed; none are skipped or unavailable.
- [ ] Every repair attempt and outcome is recorded; budget was not exceeded.
- [ ] Checkpoint identifies `B-003` and is created only after all gates pass.
- [ ] If halted, later stages were not attempted and cause/state are resumable.

## Completion evidence

Record the implementation, review, test, validation, repair, and checkpoint
results in the run record. The completion criterion is: Local content can be loaded through Drizzle, invalid data fails safely, and subset selection is bounded and testable.
