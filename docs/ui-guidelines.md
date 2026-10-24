# UI Implementation Guidelines

Use these rules for every screen in `web-game`. The product visual direction and palette remain defined by [the UX design system](../specs/02-ux/design-system.md).

## Components

- Check `web-game/components/ui/` for a shadcn/ui component before building a common interaction from scratch.
- Keep shadcn component source in `web-game/components/ui/`; customize its variants and scoped styles to match Noname instead of accepting default colors, radii, or spacing.
- Put project-wide composed controls in `web-game/components/shared/`. Keep feature-specific composition beside its feature.
- Reuse the shared Button and established icon family. Do not create screen-specific button or icon implementations when the shared component can express the design.
- Keep component props focused on behavior and meaning. Avoid broad components with unrelated display options.

## Visual system

- Use the named palette, type roles, and button contract from `specs/02-ux/design-system.md`.
- Define shared colors, typography roles, radii, and spacing as tokens. Avoid repeating raw values across screen stylesheets.
- Keep the horror visual direction, but preserve readable contrast and recognizable focus, disabled, pending, success, and error states.
- Scope screen styling beneath that screen's root class. Keep resets, tokens, and reusable component structure in global styles.
- Prefer composition and whitespace over nested surfaces. Use a card or border only when it clarifies grouping.

## Interaction and accessibility

- Use semantic HTML and shadcn/Radix behavior for dialogs, menus, and other controls that require focus management or keyboard interaction.
- Give every form control an associated label and connect helper and error messages with `aria-describedby`.
- Keep keyboard focus visible. Do not make hover the only way to discover or use an action.
- Respect `prefers-reduced-motion`; motion should explain a state change and must not delay an authoritative game action.
- Keep private team or game information within the view authorized for that user.

## Maintenance

- Keep files below 120 lines, following `RULES.md`; split a component when it has multiple responsibilities.
- Keep shared contracts and game rules out of presentation components.
- Before adding a dependency or running a shadcn CLI migration, inspect the generated files and dependency changes. Apply components one at a time and preserve the existing design contract.
