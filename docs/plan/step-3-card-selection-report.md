# Step 3 — Card Selection

**Date:** 2026-11-02 18:15 UTC
**Scope:** Work item 3 in [remaining-work.md](remaining-work.md). Product behavior follows the card selection and session management specifications.

## Implementation checklist

- [x] Assign equal card slots based on the smaller team; the extra member of the larger team cannot select and does not affect readiness.
- [x] Give each team its allowed category pool; support repeated category selections.
- [x] Keep editable drafts local and allow players to submit, replace, and remove only their own slot through validated server commands.
- [x] Track readiness, enforce the all-slot phase gate, and keep selection open after the timer expires until every slot is submitted.
- [x] Provide role-filtered player selection views and a Host roster/readiness view without private choices.
- [x] Reveal selected cards and Wolf challenges to players and Host after selection completes; cards can be flipped to preview a revealed challenge.
- [x] Preserve Sandbox defaults: Wolf Music with a random available challenge; Sheep repeats Music, Music, Travel.
- [x] Restore authoritative submitted choices after reconnect while keeping drafts client-local.

## Verification checklist

- [x] `pnpm test` — 13 files, 42 tests passed, including card selection engine, role-filtered views, transport commands, reconnect recovery, and reveal gate.
- [x] `pnpm run typecheck` — passed.
- [x] `pnpm exec tsc --noEmit -p web-game/tsconfig.json` — passed.
- [x] `pnpm run build` — passed.
- [x] `pnpm test:e2e` — browser preflight passed.
- [x] `git diff --check` — passed.

## Changed paths

- `backend/card-selection-view.ts`, `backend/lobby-card-handlers.ts`, `backend/lobby-client-handlers.ts`, `backend/lobby-session-card-selection.ts`, `backend/lobby-session-players.ts`, `backend/lobby-session.ts`, `backend/lobby-transport-context.ts`, `backend/lobby-view.ts`
- `shared/card-selection-contract.ts`, `shared/lobby-contract.ts`
- `web-game/app/card-selection.css`, `web-game/app/game-card.css`, `web-game/app/layout.tsx`, `web-game/features/game/hooks/`, `web-game/features/game/ui/components/`, `web-game/features/lobby/hooks/use-lobby-screen.ts`, `web-game/features/lobby/services/lobby-command.ts`, `web-game/features/lobby/ui/screen/LobbyScreen.tsx`
- `specs/05-features/card-selection/requirements.md`, `tests/card-selection-transport.test.ts`, `tests/e2e/application-foundation.spec.ts`

## Design reference

The Figma selection frames `2238:2` (player) and `2214:809` (Host) were requested from the connected Figma tool, but access was rate-limited. The screens follow the repository's card references and `specs/02-ux/design-system.md`; direct comparison against those two selection frames remains unavailable.

## Status

Step 3 implementation and listed verification gates are complete.
