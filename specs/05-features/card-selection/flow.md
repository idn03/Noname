# Card Selection Flow

1. Team assignment starts the Selection Phase and provides each player their own slot and allowed card choices.
2. Wolf players can inspect the available challenges. Sheep players do not receive Wolf selections.
3. A player chooses a card in a local draft and may replace or clear that draft before submission.
4. Done submits the player's complete selection to the Host. The server validates the player, slot, category, and phase before the Game Engine records it as ready.
5. A player may replace or remove a submitted choice while selection is open; the server updates that slot's readiness and authorized views.
6. When every player has a valid submitted selection, the Game Engine advances to turn gameplay and the server publishes the new phase.

The phase cannot advance with an incomplete slot. When the timer expires, selection remains open until every player submits a complete slot; it does not auto-fill cards or bypass the completion gate.
