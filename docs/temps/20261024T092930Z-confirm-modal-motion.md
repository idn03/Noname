# Confirmation Modal Motion

**Design Read:** Reading this as a Host confirmation modal in the existing Vietnamese horror game interface, preserving its dark palette and restrained motion. Dials: DESIGN_VARIANCE 3 / MOTION_INTENSITY 1 / VISUAL_DENSITY 3.

## Changes

- Removed the modal border.
- Set the modal surface to 30% black alpha while keeping its text and controls fully opaque.
- Added a short backdrop fade and modal fade/translate/scale entrance.
- Disabled the entrance effects for reduced-motion preferences.

## Validation

- [x] `npm run typecheck` — passed.
- [x] `npm run build` — passed.
- [x] `git diff --check` — passed.
- [ ] Browser screenshot review — not run.

## Reference and changed path

Reference: user-provided Host confirmation modal screenshot and existing modal styles.

- `web-game/app/host-lobby.css`
