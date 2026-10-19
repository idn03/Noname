# B-006.1 — Host Selection Overview

Use after B-006 passes. The backlog is authoritative; follow `RULES.md`,
`specs/workflow.md`, and the specifications listed below. Keep the existing
B-006 ID unchanged.

## Stage contract

- **Depends on:** B-006.
- **Scope:** Provide the Host a read-only view of both team rosters, selected
  card counts, readiness, and remaining selection time. The Host has no card
  slot and player card choices remain private.
- **Complete when:** The Host view reflects authoritative selection progress
  for all joining players without providing player actions or exposing private
  card choices.
- **Specifications:** card-selection, pages, navigation, design-system.

## Run

After reviewing the full plan, run:

```bash
bash scripts/implement-feature.sh "B-006.1 — Host Selection Overview" --scope 05-features/card-selection
```

The script prepares the browser and Playwright CLI, then runs the Coordinator.
Record implementation, review, test, validation, repair, and checkpoint
evidence. A failed required gate halts dependent stages.
