# Host team player flight

- [x] Remove team headings and player names from the Host roster after assignment.
- [x] Render assigned player names under the matching team heading at the right side of the screen.
- [x] Animate each name from its roster position to its team list position using measured element bounds.
- [x] Keep the full assignment visible to the Host only and support reduced-motion preferences.

Design Read: Host lobby transition for a multiplayer horror game, preserving its dramatic layout with restrained motion and low density. Dials: variance 3 / motion 1 / density 3.

Reference: `specs/05-features/team-assignment/design.md` authorizes the Host to observe the full assignment. Runtime motion has not been visually verified in a browser.
