# UI Refactor Baseline Inventory

Stage 1 of [the UI refactor plan](../plan/ui-refactor-plan.md), inspected 2026-11-04.

## Contract and tooling

- `specs/02-ux/design-system.md` is the visual contract. It defines the palette, numeric type sizes, button geometry, accessibility states, motion, and shared screen principles. It did not previously define styling ownership, semantic type roles, or the allowed component boundary. Those rules are now explicit there.
- `docs/ui-guidelines.md` already directs UI work to shared tokens, `components/ui/` for shadcn source, `components/shared/` for project controls, semantic form markup, scoped CSS, and one shared Button.
- Tailwind CSS v4 is installed and loaded by `web-game/app/globals.css` and `web-game/postcss.config.mjs`.
- shadcn is already set up: root `components.json` points to the app stylesheet and `@/components/ui` alias; `web-game/components/ui/` contains Button, Dialog, and Sheet wrappers. Dialog uses Radix UI and Sheet uses Base UI. These foundations exist, though Button currently delegates visual/base markup to `components/shared/Button` and both Button paths are imported. No installation or dependency change is needed.
- `web-game/app/layout.tsx` imports `globals.css` and six screen stylesheets: `lobby.css`, `host-lobby.css`, `game-card.css`, `card-selection.css`, `host-card-selection.css`, and `player-card-selection.css`.

## Reachable screens and migration scope

Next routes found under `web-game/app`:

- `/`: `LobbyScreen`, which renders the home/join state, host creation, player lobby, host lobby, selection, and post-selection waiting according to session and phase state.
- `/wolf-team` and `/sheep-team`: team instruction pages.
- `/dev/wolf-selection`: development-only local selection preview; not a product route.

`EndGameScreen` exists as a component but has no route or call site. `ManageGameScreen` and `GameScreen` were not found. The corresponding documented management/gameplay flows therefore remain future adoption requirements unless routes are added separately. The route-level migration order is home/join and instructions, lobby/team assignment, selection and challenge Sheet, then results or gameplay only if connected; consolidate CSS after consumers migrate.

## Styling and ownership baseline

- Styling is predominantly selector-based CSS: seven global-imported stylesheets total 594 lines. `globals.css` mixes resets, palette, shared buttons, lobby, and results styles. Font declarations and screen typography are distributed across `lobby.css`, `host-lobby.css`, `card-selection.css`, `player-card-selection.css`, and other screen rules.
- Tailwind utilities are not the ordinary styling method. A TSX scan found one utility use, `!text-black` in `HostHomeActions.tsx`; the rest of the observed presentation is expressed through class names backed by CSS. Inline `style` props occur in `RuneField.tsx` and `LobbyPlayerStage.tsx` for generated placement coordinates.
- Shared Button ownership is duplicated at the import/API level: some consumers import `components/shared/Button`, while selection consumers import `components/ui/button`, which delegates to the shared Button. The target public boundary is the `components/ui` shadcn wrapper; consolidation is scheduled for stage 3, not this inventory stage.
- Existing state behavior is session- and engine-driven in `LobbyScreen`/`useLobbyScreen`: host versus player views, joining/creation, lobby phases, selection actions, error/status messages, and team instruction return navigation. Preserve these state transitions and the authorized team content while migrating presentation.
- Responsive source rules include breakpoints at 520px and 700px plus fluid `clamp()` sizing. This records the source baseline; rendered phone/desktop screenshots were not captured because no project app server was available during this inventory. Capture at a narrow phone and desktop viewport before visual migration if a browser baseline is required by the stage gate.

## Stage 1 outcome

The shared contract, reachable route scope, preview-only route, unconnected documented screens, current shadcn setup, styling approach, and duplicate Button API are identified. No UI source, runtime behavior, dependency, or lockfile was changed. The remaining visual evidence gap is rendered screenshots; the current visual baseline above is derived from source inspection.

## Stage 2 progress: shared tokens and typography

- Added Tailwind v4 theme tokens in `web-game/app/theme.css` for the four contract colors, existing Judson/Georgia/Arial families, the supplied ten type sizes, semantic type roles, a 4px layout unit, observed radius values, and the existing white 3px focus ring.
- Existing CSS font-family declarations now reference the shared family tokens. Shared Button radius and existing 3px focus outlines now reference tokens with the same values. Font sizes, line heights, breakpoints, spacing declarations, colors, interaction behavior, and layout declarations remain as before.
- The live shared Button radius is 16px while the UX spec states 12px. The token records the live 16px value to preserve the current UI; the discrepancy remains visible for a product-level decision and was not silently changed.
- `pnpm build` passed after introducing the theme, enabling static token emission, and replacing existing font-family literals with equivalent shared family variables. The compiled CSS contains all ten requested size variables.
- This stage is still in progress. No rendered visual comparison or test suite was run; the repository instruction against declaring a stage complete without review, tests, and validation remains applicable.

## Tailwind `className` migration plan update

The follow-up styling scan found 423 CSS lines containing class selectors, about 200 distinct class selectors, and 167 JSX `className` declarations. There are no CSS ID selectors. Existing IDs connect headings, labels, descriptions, and in-page team links; those remain because they provide semantics and navigation. Existing `data-*` attributes are used by roster animation/measurement code and remain behavior hooks. One TSX utility styling use (`!text-black`) was found, confirming that Tailwind is not yet the normal styling path.

The revised plan in `docs/plan/ui-refactor-plan.md` makes the migration explicit: move ordinary selector styling into Tailwind utilities in `className`, screen by screen, using existing computed values as the parity target. Start with Home/Join and instructions, continue through Lobby/team assignment, then selection/Sheet, and finish with reusable primitives and cleanup. Keep scoped CSS for card-face artwork, decorative runes, choreographed roster/game-scene positioning, and keyframe animation where utilities would be brittle. Runtime-computed positioning remains inline. Each screen's CSS should be removed only after comparing it with narrow-phone and desktop rendered baselines.

No UI source was changed for this planning request. The written guidance was updated in `docs/ui-guidelines.md` and the UI refactor plan.
