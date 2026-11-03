# Player Card Selection Carousel

- **Design Read:** Mobile card-selection screen matching the supplied player screenshot, using the project's existing Judson type, rune field, and blood-red to black palette.
- **Dials:** Variance 5, motion 2, density 3.
- Replaced the category grid with a native horizontally scrollable, snap-centered carousel. The active card stays centered and adjacent cards peek into view.
- Added the matching phase title, score, large countdown, hint, CHỌN action, selected category feedback, and own-team roster footer.
- The team roster contains only teammates; Sheep views still receive category challenge counts without challenge text.
- Verification: `git diff --check` passed. Tests and browser preview were not run for this update.
