# Host Card Selection Design Update

- **Design Read:** Implement the supplied Host card-selection screenshot as the visual reference, preserving the project's Judson typography, rune backdrop, and blood-red to black palette.
- **Dials:** Variance 6, motion 2, density 5.
- Replaced the centered progress panel with the full-viewport two-team layout, central live timer, selected-category pills, bottom match actions, and team jump controls.
- Host snapshots now expose submitted category names while withholding challenge text. Sheep still cannot see Wolf selections during selection.
- Aligned the timer to one minute per card slot on each team: a 3-round game starts at 3:00. The timer already existed but previously started at 6:00 for three slots per team.
- History and replay remain visible but disabled because those actions are not implemented yet.
- Verification was not run for this UI update.
