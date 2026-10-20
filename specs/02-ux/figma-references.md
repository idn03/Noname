# Figma Interface References

These frames are visual references for the screen and interaction contracts in [pages.md](pages.md), [navigation.md](navigation.md), and [application-flow.md](application-flow.md). Product behavior and server authority remain defined by those specifications and the feature contracts.

## Screen references

| Screen | Figma frame |
| --- | --- |
| HomeScreen, Host | [Host setup](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2183-9) |
| HomeScreen, player | [Player join](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2192-857) |
| LobbyScreen, Host | [Host lobby](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2203-1028) |
| LobbyScreen, player | [Player lobby](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2239-255) and [team reveal](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2233-2) |
| SelectCardScreen, Host | [Host card overview](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2214-809) |
| SelectCardScreen, player | [Player card selection](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2238-2) |
| ManageGameScreen, Host | [Match management](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2203-970) |
| GameScreen, player | [Gameplay](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2214-748) |
| SheepTeamScreen, player | [Sheep rules](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2192-932) |
| WolfTeamScreen, player | [Wolf rules](https://www.figma.com/design/vi5064YHv4FnNJlMy7eXNL/other-apps?node-id=2199-949) |

EndGameScreen has no supplied Figma frame. Its visual design extends the project palette and existing team imagery while following the Results contract in [pages.md](pages.md) and [scoring-results](../05-features/scoring-results/design.md).

## Shared visual direction

- Use a wine-red-to-black horror atmosphere, scattered rune imagery, and the
  supplied display font when available. Keep interface text and actions clear
  over decorative background imagery.
- Use the established project colors and team assets defined in
  [design-system.md](design-system.md). Do not replace or redraw supplied
  Figma assets with approximations.
- Player screens have a maximum width of 402px. Host screens target desktop;
  Host responsiveness is not currently required. Do not add an iPhone taskbar
  mockup.
- Rune background layers may move vertically in independent, slow loops, with
  varied start times and alternating directions. Respect reduced-motion
  preferences and keep runes low contrast beneath content.
- Lobby team reveal fades out names outside the player's team, contracts the
  roster frame, then fades in the team name. Card categories scroll
  horizontally; opening a card presents its challenge list in a bottom sheet.
- End Game must display the same server-confirmed scores and outcome to Host
  and players. Do not imply a local result or animate before confirmation.

The supplied font and background files are added to the project separately; until then, implementations should use available local assets and system fallbacks without inventing replacement artwork.
