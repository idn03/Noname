# Host Sandbox Lobby UI Fix

**Design Read:** Reading this as a Host lobby in a Vietnamese local multiplayer game, preserving the existing restrained horror style. Dials: DESIGN_VARIANCE 3 / MOTION_INTENSITY 1 / VISUAL_DENSITY 3.

## Changes

- Positioned Host roster tokens within the roster panel so simulated player names render in the visible play area.
- Moved start confirmation into the existing portal-based modal pattern.
- Set both modal actions to mobile button borders and added vertical button padding.
- Added a dark backdrop and clear modal surface for the confirmation state.

## Validation

- [x] `npm run typecheck` — passed.
- [x] `npm run build` — passed.
- [x] `git diff --check` — passed.
- [ ] Browser screenshot and interactions — not run; runtime presentation remains unverified.

## Reference and changed paths

Reference: user-provided Host lobby screenshot and existing Host lobby CSS/components.

- `web-game/app/host-lobby.css`
- `web-game/features/lobby/ui/components/LobbyHostActions.tsx`
