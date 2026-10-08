# Card Selection Tests

## Unit and Integration Coverage

- Each player can select only their own slot; duplicate categories are accepted.
- An unsubmitted draft does not change server state.
- Done accepts a complete valid selection and marks only that player's slot ready.
- Replacement and removal update readiness only while selection is active; commands after phase transition are rejected.
- The turn phase begins only when every player has a complete submitted selection.
- Wolf can inspect available challenges; Sheep cannot receive Wolf selections before reveal.
- Invalid categories, player identities, and phases are rejected without partial changes.
- Timer expiry does not auto-fill cards or advance the phase while any slot is incomplete; selection stays open until all players submit.

## Browser Flow Coverage

- A player can choose, revise, remove, and submit their own card.
- Refresh restores a submitted selection from server state.
- Players see the next phase only after all player slots are complete.
