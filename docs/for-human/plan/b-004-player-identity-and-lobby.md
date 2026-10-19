# B-004 — Player Identity and Lobby

Use this sheet after the full plan is reviewed. The authoritative stage definition
is in [backlog.md](../../../specs/07-planning/backlog.md); workflow gates are in
[workflow.md](../../../specs/workflow.md). Follow `RULES.md` and the stage's
relevant specifications. Do not expand the scope to another backlog stage.

## Stage contract

- **Depends on:** B-001, B-002.
- **Scope:** Name-free Host observer session creation, player join by display name, server-issued identities, lobby presence, 10-player capacity excluding Host, disconnect handling, and refresh recovery.
- **Complete when:** The local operator creates a room as Host observer; valid players can join and reconnect; remote clients cannot create sessions or claim Host authority; invalid joins are rejected safely. Sandbox mode is completed in B-004.1.

## Run prompt

Run the Coordinator workflow for this backlog stage:

```bash
bash scripts/implement-feature.sh "B-004 — Player Identity and Lobby" --scope 05-features/authentication
```

The script starts the configured provider in this repository and asks the
Coordinator to use the roles in `agents/` for implementation, review, testing,
validation, bounded repairs, and checkpointing. Set `NONAME_PROVIDER=opencode`
before the command to select OpenCode; Codex is the default. The Coordinator
must halt for plan approval when needed and cannot checkpoint without passing
gate evidence. The runner reuses a healthy server at `127.0.0.1:3000` or starts
one for the workflow, checks that Playwright CLI can launch Chromium, and stops
only the server it started. A failed preflight halts before Cycle 1 and does
not consume a repair cycle; fix the environment and resume B-004.

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
- [ ] Checkpoint identifies `B-004` and is created only after all gates pass.
- [ ] If halted, later stages were not attempted and cause/state are resumable.

## Completion evidence

Record the implementation, review, test, validation, repair, and checkpoint
results in the run record. The completion criterion is: Valid players can join and reconnect to the running Host; invalid joins and identity claims are rejected safely.
