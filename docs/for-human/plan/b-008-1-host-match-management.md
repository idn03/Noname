# B-008.1 — Host Match Management

Use after B-008 passes. The backlog is authoritative; follow `RULES.md`,
`specs/workflow.md`, and the specifications listed below. Keep the existing
B-008 ID unchanged.

## Stage contract

- **Depends on:** B-008.
- **Scope:** Add the Host-only ManageGameScreen with current round, Wolf attack
  card, Hoàn Thành and X controls; text match history; cancel to HomeScreen; and
  replay with unchanged teams back to card selection.
- **Complete when:** Host controls and history reflect authoritative state;
  cancel and replay synchronize the specified state and destinations.
- **Specifications:** turn-gameplay, session-management, scoring-results,
  pages, navigation.

## Run

After reviewing the full plan, run:

```bash
bash scripts/implement-feature.sh "B-008.1 — Host Match Management" --scope 05-features/turn-gameplay
```

The script prepares the browser with Playwright Test, then runs the Coordinator.
Record implementation, review, test, validation, repair, and checkpoint
evidence. A failed required gate halts dependent stages.
