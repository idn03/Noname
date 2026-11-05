# Card Selection Tests

## Unit and Integration Coverage

- Each player can select only their own slot; duplicate categories are accepted, but Wolf teammates cannot select the same challenge within a category.
- When teams are uneven, one member of the larger team has no slot and is excluded from selection readiness.
- An unsubmitted draft does not change server state.
- Done accepts a complete valid selection and marks only that player's slot ready.
- Replacement and removal update readiness only while selection is active; commands after phase transition are rejected.
- The turn phase begins only when every card slot has a complete submitted selection.
- Wolf can inspect challenge text during selection; Sheep sees only the number of available challenges per category and receives no challenge text or Wolf selections before reveal.
- Host progress shows both rosters, slot counts, and readiness without card choices; the larger team’s slotless member cannot submit.
- Invalid categories, player identities, and phases are rejected without partial changes.
- Timer expiry does not auto-fill cards or advance the phase while any slot is incomplete; selection stays open until every card slot is submitted.

## Browser Flow Coverage

- A player can choose, revise, remove, and submit their own card.
- Refresh restores a submitted selection from server state.
- Players see the next phase only after all card slots are complete.
