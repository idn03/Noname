# Design System

## Visual Direction

Use a restrained horror-inspired visual theme. The interface should feel tense and atmospheric while keeping game state, instructions, and actions easy to understand. Favor clear hierarchy and generous contrast over decorative effects. Visual polish must not obscure the core game loop.

## Color Palette

Use the four project colors as the primary palette:

- **Blood red — `#722F37`:** primary emphasis, active gameplay state, and important actions.
- **Black — `#000000`:** primary background and dark surfaces.
- **Gray — `#5A5A5A`:** secondary surfaces, borders, and supporting text where contrast remains sufficient.
- **White — `#FFFFFF`:** primary text, icons, and high-contrast content.

Use color with labels, icons, or text so meaning is never communicated by color alone. Preserve readable contrast for text and interactive controls. Avoid introducing additional accent colors as part of the core theme.

## Typography and Layout

Use a legible type system with clear distinction between page titles, phase or round status, body text, and supporting labels. Keep challenge text and player names readable at a distance on common phone and desktop screens. Layouts should adapt from narrow phones to tablets and desktop browsers without hiding primary actions or essential game information.

## Components and Interaction

Use shadcn/ui components as the starting point for common controls and status patterns, styled to match this palette and visual direction. Keep interaction states consistent for default, hover, focus, disabled, pending, success, and error. Provide visible keyboard focus, accessible names, and touch-sized controls. Do not rely on hover for essential behavior.

Use motion sparingly for phase changes or card reveals. Respect reduced-motion preferences, and ensure animation never delays or conceals the authoritative result of an action. Avoid decorative effects that reduce legibility or slow play.

## Shared UI Principles

- Make the current phase, round, team scores, and next available action easy to find.
- Distinguish private and public game information through the authorized content provided to each player.
- Communicate pending, confirmed, and rejected actions clearly.
- Keep visual treatment consistent across Join, Lobby, Selection, Gameplay, and Results.
- Prefer simple surfaces and typography over nested cards or excessive ornament.
