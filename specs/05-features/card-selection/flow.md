# Card Selection Flow

1. Team assignment starts the Selection Phase and provides each card-slot owner their slot and allowed card choices. In an uneven match, the designated slotless player receives no card choices.
2. Wolf players can inspect challenge text. Sheep players can see only the number of available challenges per category, not their text or Wolf selections. The Host sees submitted category names and team readiness but not challenge text.
3. A player browses the card carousel and selects a card in a local draft. The centered card is fully opaque and visibly outlined as the active choice.
4. Done submits the player's complete selection to the Host. The server validates the player, slot, category, and phase before the Game Engine records it as ready.
5. After a choice is submitted, lock carousel swiping and card changes. While selection remains open, the player can use “Bỏ chọn” to remove the submitted choice; after removal, the carousel unlocks so the player can browse and submit a replacement. The server updates that slot's readiness and authorized views.
6. When every card slot has a valid submitted selection, the Game Engine advances to turn gameplay and the server publishes the new phase with selected cards and Wolf challenge text revealed to all players and the Host. Before this transition, Sheep and Host views contain no Wolf card choices or challenge text.

The timer lasts one minute per card slot on each team (the round count). The phase cannot advance with an incomplete slot. When the timer expires, selection remains open until every player submits a complete slot; it does not auto-fill cards or bypass the completion gate.
