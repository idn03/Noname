# Turn Gameplay Tests

## Unit and Integration Coverage

- Only the owner can reveal a Wolf card, and a used card cannot be revealed again.
- A second attack is rejected while one attack remains unresolved.
- Only an unused matching-category card in a Sheep player's own slot can defend.
- When multiple Sheep players qualify, only the first valid defense processed is accepted.
- A defense from a different category or a later duplicate defense is rejected without mutation.
- An attack with no remaining matching Sheep card resolves as undefended.
- The defender is associated with the challenge; challenge selection uses the attack category and avoids repeats when alternatives remain.
- Only the Host can record one outcome for the active challenge; duplicate or out-of-phase results are rejected.
- Rounds advance exactly to the configured limit and no further attack is accepted afterward.

## Browser Flow Coverage

- The Wolf card owner can reveal their card and all clients receive authorized attack state.
- An eligible Sheep player can defend and follow the challenge flow.
