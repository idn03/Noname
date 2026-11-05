# UI/UX Refactor Plan

## Goal and scope

Create a consistent, maintainable interface across the Noname game by using
Tailwind CSS as the default styling method, a shared typography system, and
project-styled shadcn foundations for Button, Dialog, and Sheet. Keep custom
CSS limited to cases where utilities are unsuitable, such as intricate card
artwork or positioned game-scene decoration. Keep gradients and shadows
minimal. Preserve the horror-inspired visual direction, legibility, gameplay
clarity, responsive behavior, accessibility, and all existing game behavior.
This is a code-organization and styling-consistency refactor, not a redesign:
the current rendered UI is the visual baseline, and migrations must preserve
its appearance and responsive behavior unless a separate product change is
requested.

This plan covers shared foundations and every existing browser screen. It does
not add gameplay features or invent missing product behavior. The product
contract remains [the UX design system](../../specs/02-ux/design-system.md),
with screen requirements in [Pages and UI States](../../specs/02-ux/pages.md).
Implementation choices are in [UI Implementation Guidelines](../ui-guidelines.md).

## Findings and working assumptions

- `components.json` and local Button, Dialog, and Sheet wrappers exist. The
  wrappers and installed primitive APIs should be inspected before migration;
  avoid replacing them wholesale or adding dependencies without need.
- A project shared Button also exists, creating overlapping ownership with the
  shadcn-based Button wrapper. Consolidate to one public shared Button API.
- Styling currently spans `globals.css` and multiple screen CSS files. Tailwind
  is imported, but the implementation predominantly uses custom CSS selectors.
- Typography varies among Arial, Judson, Georgia, and page-specific sizes.
  Preserve distinct font character only where intentional, but define and reuse
  named type roles and font tokens across screens.
- Current code includes Home/Join, Lobby, Host team assignment, card selection,
  team instruction, Results, and a Wolf selection preview route. Gameplay
  screens and some documented flows may be incomplete or unconnected; verify
  route reachability and behavior before scheduling their migration. Treat the
  preview route as development-only unless product requirements say otherwise.
- Existing UI contracts require privacy boundaries, authoritative server state,
  reduced-motion support, visible focus, accessible status/error handling, and
  usable phone, tablet, and desktop layouts. Preserve these during visual work.

## Target UI rules

1. Put ordinary styling in JSX `className` values using Tailwind utilities for
   layout, spacing, responsive behavior, typography, colors, borders, and
   interaction states. Do not create named CSS classes or IDs solely to style
   those concerns.
2. Use shadcn foundations only for Button, Dialog, and Sheet. Customize variants,
   sizes, and styling to Noname through their props and shared component layer.
   Do not introduce additional shadcn component types as a default pattern.
3. Use one shared Button API on all screens. Provide the agreed project sizes
   and variants without screen-specific button implementations.
4. Define shared font families and semantic type roles (display, page title,
   section title, body, supporting text, and label) once. Pages select roles;
   they do not redefine the system's base scale or font pairing locally.
5. Keep reusable design values in shared CSS/Tailwind theme tokens. Prefer flat
   composition and whitespace. Use gradients, shadows, and decorative effects
   sparingly and only where they support the intended atmosphere or hierarchy.
6. Keep custom CSS for genuinely complex artwork, animation, or layout that is
   awkward or unreadable as utilities. Current candidates are card-face
   artwork, decorative rune positioning, roster choreography, and keyframes.
   Scope each exception and document its reason briefly in the implementation
   review. Runtime-computed positions may remain inline styles.
7. Do not change the product palette, UX requirements, server-authoritative
   state, or team privacy as an incidental result of styling migration. Update
   the UX design-system spec if shared product-level visual behavior changes.

IDs remain for labels, accessible relationships, and in-page navigation; they
are not styling hooks. Keep `data-*` attributes for behavior and animation
hooks. During migration, move existing declarations into equivalent utilities
without changing their computed values. Remove each CSS rule only after the
screen has been compared against its visual baseline.

## Ordered implementation stages

Each stage is a separate, reviewable change. Follow the repository workflow:
plan, implement, review, test, validate, then checkpoint. Do not start a
dependent stage until its prerequisite is complete.

### 1. Contract and baseline inventory

- Reconcile this plan with `specs/02-ux/design-system.md` and
  `docs/ui-guidelines.md`; make the component boundary, Tailwind default, and
  typography reuse explicit in the authoritative design-system spec.
- Inventory reachable routes, screen roots, shared controls, CSS imports,
  inline styles, typography declarations, and current interaction states.
- Record existing behavior and rendered visual baselines at a narrow phone and
  desktop width. Identify dead or preview-only UI without treating it as a
  product screen.
- **Exit:** shared contract is unambiguous; migration scope and order are based
  on actual reachable screens; no implementation begins with unresolved
  component ownership.

### 2. Shared tokens and typography

- Establish the palette, font families, semantic type roles, responsive type
  scale, spacing/radius conventions, focus ring, and state colors as shared
  tokens usable from Tailwind.
- Map the existing design-system sizes to roles and resolve inconsistent font
  assignments without reducing challenge/player-name readability.
- Remove duplicate global typography rules as consumers migrate; do not create
  parallel page-specific scales.
- **Exit:** each role has one definition and documented intended use; the
  current screens can adopt the roles without losing responsive sizing.

### 3. Shared interactive primitives

- Make the shadcn-based Button wrapper the sole shared Button API; define
  project variants, default/mobile sizing, focus, disabled, and pending states.
- Keep Dialog and Sheet wrappers on their shadcn foundations and align their
  tokens, focus handling, close behavior, and responsive presentation.
- Use semantic HTML and Tailwind for ordinary form fields such as the name
  input; do not add a shadcn Input solely for consistency.
- Associate form labels, helper text, and errors with their controls. Preserve
  confirmation, cancel, and delete behavior.
- **Exit:** all current Button/Dialog/Sheet usages use shared wrappers; no
  duplicate button implementation remains; keyboard and touch behavior is
  consistent.

### 4. Home, Join, and team instructions

- Migrate Home/Join, host creation, name form, and Wolf/Sheep instruction views
  from selector-based styling to Tailwind utilities in `className`, using
  shared tokens and typography roles.
- Preserve host-only creation, join/resume behavior, validation feedback, and
  return navigation. Retain only necessary backdrop/artwork CSS.
- **Exit:** layouts work at phone and desktop sizes; form accessibility and
  existing navigation are preserved; page-local typography overrides are
  removed where a shared role applies.

### 5. Lobby and Host team assignment

- Migrate player Lobby, Host Lobby, and team assignment surfaces in that order.
- Move ordinary layout, spacing, typography, color, border, and responsive
  declarations to `className` utilities; retain only justified roster
  choreography and runtime placement rules in scoped CSS.
- Standardize roster, connection, phase, count, action, and status typography;
  keep Host controls and player-visible information correctly separated.
- Retain custom positioning only for the team-map/roster composition where
  utility-only markup would be brittle or obscure.
- **Exit:** shared actions and typography are consistent; responsive layouts
  preserve all required controls and status information.

### 6. Card selection and challenge Sheet

- Migrate player and Host selection views, cards, readiness, timers, and
  challenge Sheet. Use shared roles for timer labels, card titles, challenge
  copy, and supporting metadata.
- Move ordinary surrounding layout and responsive rules to `className`
  utilities. Keep card artwork and precise card-face composition in scoped CSS
  when utilities would make it brittle or obscure.
- Preserve Wolf/Sheep information boundaries, edit eligibility, countdown,
  submission status, and Host observation-only behavior.
- **Exit:** selection flows and privacy match the feature specs; Sheet uses the
  shared primitive; custom styling is limited to card-specific presentation.

### 7. Gameplay and Results

- First verify whether Gameplay/Manage Game routes are implemented and
  reachable. Migrate existing screens; if absent, record them as future
  adoption requirements and do not create gameplay behavior in this refactor.
- Migrate Results and any existing gameplay surfaces to shared roles, tokens,
  Tailwind-first layout, and shared controls.
- Preserve authoritative scores, eligible actions, challenge outcomes, replay,
  cancellation, and completion states.
- **Exit:** implemented screens satisfy the existing page and feature
  requirements; missing screens remain explicitly identified as out of scope.

### 8. Consolidation and quality review

- Remove obsolete screen CSS and duplicate declarations after all consumers
  migrate. Keep global CSS to Tailwind setup, resets, tokens, and truly shared
  component rules; ordinary screen styling should no longer depend on named
  CSS selectors. Avoid a large one-shot stylesheet rewrite.
- Review each implemented state at phone, tablet, and desktop widths; check
  keyboard navigation, focus, labels, announcements, contrast, touch targets,
  reduced motion, and browser console/network errors.
- Review visual consistency: typography roles reused, one Button API, only the
  three designated shadcn foundations, Tailwind as the default, and minimal
  decorative custom styling.
- Run focused behavior checks and configured repository validation for each
  implementation stage. Missing or unavailable required checks do not count as
  passing. Record evidence and checkpoint completed stages per `RULES.md`.
- **Exit:** all in-scope gates pass, no known regression remains, and any
  deferred screen or styling exception is recorded with a clear reason.

## Completion criteria

- The UX spec and implementation guidelines express the same component,
  typography, and styling boundaries as this plan.
- Button, Dialog, and Sheet use customized shadcn foundations; no other shadcn
  component type is introduced as the default styling solution.
- Tailwind is the ordinary styling method; remaining custom CSS is scoped and
  justified by a complex visual need. Ordinary screen styling lives in
  Tailwind utilities in JSX `className`, and IDs are not styling hooks.
- Every implemented screen reuses shared typography roles and tokens.
- Existing navigation, game behavior, privacy, accessibility, and responsive
  requirements continue to pass their relevant quality gates.
