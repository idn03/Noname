# B-006.2 — Sandbox Card Defaults

Use after B-006.1 and B-004.1 pass. The backlog is authoritative; follow
`RULES.md`, `specs/workflow.md`, and the specifications listed below. Keep the
existing B-006 ID unchanged.

## Stage contract

- **Depends on:** B-006.1, B-004.1.
- **Scope:** In Sandbox, select Music for every Wolf slot and one random
  available challenge; select two Music cards and one Travel card for Sheep.
- **Complete when:** The requested defaults are applied to Sandbox player
  selections and authoritative readiness and completion gates remain valid.
- **Specifications:** card-selection, session-management, business-rules.

## Run

After reviewing the full plan, run:

```bash
bash scripts/implement-feature.sh "B-006.2 — Sandbox Card Defaults" --scope 05-features/card-selection
```

The script prepares the browser and Playwright CLI, then runs the Coordinator.
Record implementation, review, test, validation, repair, and checkpoint
evidence. A failed required gate halts dependent stages.
