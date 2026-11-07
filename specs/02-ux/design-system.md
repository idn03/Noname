# Design System

## Visual Direction

Use a restrained horror-inspired visual theme. The interface should feel tense and atmospheric while keeping game state, instructions, and actions easy to understand. Favor clear hierarchy and generous contrast over decorative effects. Visual polish must not obscure the core game loop.

## Color Palette

Use the four project colors as the primary palette:

- **Blood red — `#722F37`:** primary emphasis, active gameplay state, and important actions.
- **Black — `#000000`:** primary background and dark surfaces.
- **Gray — `#8D8D8D`:** secondary surfaces, borders, and supporting text where contrast remains sufficient.
- **White — `#FFFFFF`:** primary text, icons, and high-contrast content.

Use color with labels, icons, or text so meaning is never communicated by color alone. Preserve readable contrast for text and interactive controls. Avoid introducing additional accent colors as part of the core theme.

## Typography and Layout

Use a legible type system with clear distinction between page titles, phase or round status, body text, and supporting labels. Type sizes: heading1 128px, heading2 80px, heading3 48px, heading4 40px, heading5 36px, heading6 32px, title1 24px, title2 20px, subtitle 16px, and content 14px. Semantic roles map display to heading1, page title to heading3, section title to heading4, body to content, supporting text to subtitle, and labels to content. Keep challenge text and player names readable at a distance on common phone and desktop screens. Layouts should adapt from narrow phones to tablets and desktop browsers without hiding primary actions or essential game information.

Use Judson as the only font family for project text. Load its regular, bold, and italic faces and use weight to distinguish display, page title, section title, body, supporting text, and label roles. All semantic roles use Judson; screens do not establish competing font families or base scales. Style all screen and component presentation with Tailwind utilities in JSX `className` values, including complex artwork, animation, responsive behavior, and interaction states. Do not add screen/component stylesheets or named CSS selectors for presentation. Keep global CSS limited to Tailwind setup, resets, font loading, and shared theme tokens. Use inline style values only when a behavior requires a runtime-computed value that cannot be represented by Tailwind classes.

Refactoring styling methods must preserve the current rendered interface and existing interaction behavior. Treat the current UI as the visual baseline: do not change its palette, typography appearance, sizing, spacing, composition, responsive behavior, or states as incidental cleanup. Change presentation only when a separate product requirement calls for it.

## Components and Interaction

Use project-styled shadcn foundations for Button, Dialog, and Sheet only. Keep their shared wrappers as the public component boundary and style them to match this palette and visual direction. Use semantic HTML and Tailwind for ordinary form fields; do not add other shadcn component types as the default styling pattern. Keep interaction states consistent for default, hover, focus, disabled, pending, success, and error. Provide visible keyboard focus, accessible names, and touch-sized controls. Do not rely on hover for essential behavior.

Use one shared Button component across screens, with default, outline, mobile, small, and ghost variants. Default and outline preserve the project button frame; mobile uses the compact frame; small uses 24px label text, 20px vertical padding, and border widths of 2px top, 4px left and right, and 6px bottom; ghost removes the frame. Buttons have a transparent background, 12px corner radius, and default/mobile sizes: default uses 4px top, 6px left and right, and 10px bottom border widths; mobile uses 1px top, 2px left and right, and 4px bottom widths. Keep utility typography overrides effective on button labels.

Use the shared PressableText component for actions presented as interactive text. It remains a semantic button with keyboard focus, disabled, and touch target behavior.

Use motion sparingly for phase changes or card reveals. Respect reduced-motion preferences, and ensure animation never delays or conceals the authoritative result of an action. Avoid decorative effects that reduce legibility or slow play.

## Shared UI Principles

- Make the current phase, round, team scores, and next available action easy to find.
- Distinguish private and public game information through the authorized content provided to each player.
- Communicate pending, confirmed, and rejected actions clearly.
- Keep visual treatment consistent across Join, Lobby, Selection, Gameplay, and Results.
- Prefer simple surfaces and typography over nested cards or excessive ornament.
