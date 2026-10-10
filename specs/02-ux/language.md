# User-Facing Language

All text rendered by `web-game` for players must be in natural Vietnamese,
including page titles, navigation, buttons, field labels, instructions, game
rules, card categories, challenges, phase and connection states, validation and
error messages, notifications, accessibility names, and document metadata.

Use Vietnamese diacritics and consistent terms from the product glossary. Show
Wolf and Sheep as **Sói** and **Cừu**, and Host as **Chủ phòng** in player-facing
copy. Internal identifiers, protocol values, and source code names may remain
English but must not leak into the interface. Player-provided names are shown
as entered.

Do not mix English interface copy into Vietnamese screens or rely on a browser
locale to translate content. Any third-party UI rendered in the app must also
be configured for Vietnamese. New or changed user-visible content must be
reviewed in Vietnamese as part of UI review and covered by relevant tests.
