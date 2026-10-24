# UI Review and Refactor Plan

## Current UI review

The implemented browser flow currently contains Host and player Home/Lobby states and the Host team-assignment view. A Results screen component exists but is not connected to the current route. Card selection and turn gameplay screens are not present in `web-game/features` yet.

- `components.json` was already configured for shadcn, but the project had no shadcn component files or Radix dependency. The Host confirmation modal was a hand-built portal with custom focus and close timing.
- The confirmation UI now uses a local shadcn `Dialog` component backed by Radix. Its CSS keeps the existing dark overlay, translucent surface, button sizing, and enter/exit motion.
- One shared project Button is used, but it is a raw HTML wrapper rather than a shadcn-based component. The name form input is also raw HTML. The name form's helper text is omitted from `aria-describedby` whenever an error is present, so both messages should be associated.
- Screen styles are spread across `globals.css`, `lobby.css`, and `host-lobby.css`; `globals.css` also owns results styles. Repeated colors, typography, button rules, and breakpoints make visual changes harder to apply consistently.
- Typography uses Judson, Georgia, and Arial by screen or component. These can remain distinct where the design calls for them, but their roles need to be explicit. Some rules use inline SVG or literal bullet glyphs, and some color overrides are embedded in JSX classes.
- Existing screens include reduced-motion handling, but it is split between global selectors, screen CSS, and component animation logic. Consolidate the policy as screens are refactored.

## Ordered work

1. **Dialog foundation — complete.** Add the shadcn Dialog and Radix dependencies, replace the manual portal, retain the current visual treatment, and keep confirmation/cancel/delete behavior under the existing Host actions.
2. **Shared controls.** Migrate the shared Button onto shadcn's Button foundation with the project's default/mobile sizes. Add a styled shadcn Input and use it in the name form. Associate both helper and error text with the input.
3. **Design tokens and CSS ownership.** Define shared palette, typography roles, spacing, radii, focus, and state tokens. Keep only reset/tokens/shared structures in global CSS; move results styling into a results stylesheet and keep lobby and Host-lobby styles scoped to their screens.
4. **Screen passes.** Refactor Home, Lobby, Host team assignment, and Results in that order. Use shadcn primitives for common controls and custom composition for the game's distinctive layouts. Preserve authoritative state, player privacy, and existing behavior.
5. **Accessibility and responsive pass.** Review keyboard flow, focus restoration, labels, status/error announcements, contrast, touch targets, narrow layouts, and reduced-motion behavior across every implemented state.
6. **Future screens.** Apply the same tokens and components as card selection and turn gameplay UI are implemented; do not invent screens or interactions as part of this cleanup.

Complete each item as a small, reviewable change. Keep [the UX design system](../../specs/02-ux/design-system.md) as the product-level visual contract and use [UI Implementation Guidelines](../ui-guidelines.md) for implementation choices.
