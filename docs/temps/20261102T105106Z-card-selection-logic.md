# Card Selection Logic Run

## Scope

Implemented the card-selection engine stage for item 3 in `docs/plan/remaining-work.md`. The stage remains open for client UI and realtime transport work.

## Decisions

- Teams receive equal card-slot counts matching the smaller team; the last shuffled member of the larger team is slotless.
- Selection duration is one minute per slot across both teams. Expiry does not bypass completion.
- Team category pools contain one more category than slots. Sandbox Sheep defaults repeat Music, Music, Travel.
- Wolves receive challenge text; Sheep and Host views do not expose private challenge/choice details.

## Validation

- `pnpm test`: passed, 12 files / 41 tests.
- `pnpm run typecheck`: passed.
- `git diff --check`: passed.
