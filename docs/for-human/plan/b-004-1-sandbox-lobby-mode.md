# B-004.1 — Sandbox Lobby Mode

Use after B-004 passes. The backlog is authoritative; follow `RULES.md`,
`specs/workflow.md`, and the specifications listed below. Keep the existing
B-004 ID unchanged.

## Stage contract

- **Depends on:** B-004.
- **Scope:** Add the three-second TẠO hold, populate Sandbox with 6–10
  simulated players, and
  reject real-player link joins to Sandbox.
- **Complete when:** The Host can create Sandbox with a valid simulated roster;
  real-player admission to Sandbox is rejected.
- **Specifications:** session-management, authentication, pages, application-flow.

## Run

After reviewing the full plan, run:

```bash
bash scripts/implement-feature.sh "B-004.1 — Sandbox Lobby Mode" --scope 05-features/session-management
```

`implement-feature.sh` prepares the browser and Playwright CLI, then runs the
Coordinator. The Coordinator must also read all required shared contracts and
the relevant UX and product specifications. Record implementation, review,
test, validation, repair, and checkpoint evidence before marking this stage
complete. A failed required gate halts dependent stages.
