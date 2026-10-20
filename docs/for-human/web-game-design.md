# Web Game Interface Design

## Visual direction

The game uses a restrained supernatural horror mood: wine red fading into black, scattered rune marks, high contrast white text, and large serif display type. The atmosphere stays behind the game state and primary actions. The player layout is capped at 402px; Host screens use the available desktop width and are not currently optimized for smaller viewports.

The current shared palette is blood red `#722F37`, black `#000000`, gray `#8D8D8D`, and white `#FFFFFF`. Team and outcome meaning must also use labels or text. Use the existing team portraits for team imagery. When the supplied font and rune background assets arrive, wire them through local assets and preserve their proportions.

## Screen direction

| Screen | Layout and interaction |
| --- | --- |
| Home, Host | Wide rules overview with separate Sheep and Wolf explanations and a prominent room creation action. A three-second hold creates Sandbox. |
| Home, player | 402px composition with game title, name entry, next action, and Sheep/Wolf rules shortcuts. Joining with no active room reports that clearly. |
| Lobby, Host | Wide player roster, joined count, start readiness, Sandbox indication, and Host room controls. |
| Lobby, player | Compact roster and count. During team reveal, non-team names fade, the roster frame contracts, then the team name fades in. |
| Select Card, Host | Wide view of both team rosters and submitted card counts with remaining time and shared Host actions. |
| Select Card, player | Horizontal category carousel. Opening a card presents its challenges in a bottom sheet; Wolf players choose one challenge before confirming. |
| Manage Game, Host | Wide round overview, challenge card, completion and dismiss controls, plus match history, cancel, and replay actions. |
| Game, player | Round and score status, revealed attack card, eligible defense action, chosen card, and the defending Sheep roster. |
| Team rules, player | Full-bleed Sheep or Wolf portrait with a concise team title and rules content. |
| End Game, Host and player | Shared confirmed result, both final scores, winning team or draw, and completed-session status. |

## Motion and accessibility

Motion intensity is low. Reserve transitions for phase changes and card or team reveals. Use staggered delays only when they help explain sequence, and disable nonessential animation under `prefers-reduced-motion`. Keep touch actions large, labels visible, keyboard focus obvious, and errors in an announced status region. Never use animation to delay a confirmed game result.

Rune background movement may use independent, slow vertical loops in alternating directions after the supplied rune assets are available. Do not let rune contrast compete with text. No iPhone taskbar mockup is required.

## Reference and implementation status

The visual references are in Figma file `other-apps`:

- [Home, Host](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2183-9)
- [Home, player](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2192-857)
- [Lobby, Host](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2203-1028)
- [Lobby, player](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2239-255) and [team reveal](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2233-2)
- [Select Card, Host](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2214-809)
- [Select Card, player](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2238-2)
- [Manage Game](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2203-970)
- [Game](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2214-748)
- [Sheep rules](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2192-932) and [Wolf rules](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2199-949)

The End Game composition is an original extension using the established palette and team assets. Font files and `public/assets/background` were not present at implementation time.

The current application only connects the lobby transport. The EndGameScreen is a typed presentational component that requires an authoritative result snapshot; it does not fabricate scores or transition state. Other gameplay screens require their corresponding server views and commands before integration.
