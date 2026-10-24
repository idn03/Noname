# Confirmation Modal Exit Effect

**Design Read:** Reading this as a Host confirmation modal in the existing Vietnamese horror game interface, preserving the dark palette and restrained motion. Dials: DESIGN_VARIANCE 3 / MOTION_INTENSITY 1 / VISUAL_DENSITY 3.

## Changes

- Added a close phase that keeps the modal mounted while its fade/translate/scale exit animation runs.
- Confirmation and cancellation actions now run after the exit effect completes.
- Added fade-only entrance and exit effects when reduced motion is requested.

## Validation

- [x] `npm run typecheck` — passed.
- [x] `npm run build` — passed.
- [x] `git diff --check` — passed.
- [ ] Browser animation review — not run.

## Reference and changed paths

Reference: user-provided Host confirmation modal screenshot and existing modal styles.

- `web-game/app/host-lobby.css`
- `web-game/features/lobby/ui/components/LobbyHostActions.tsx`
- `web-game/features/lobby/hooks/use-lobby-host-actions.ts`
