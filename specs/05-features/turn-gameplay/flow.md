# Turn Gameplay Flow

1. The Game Engine begins the next round and awaits an unused card from its selecting Wolf player.
2. That player reveals their card. The server validates ownership, availability, phase, and that no other attack is active.
3. The server reveals the attack category and an unused challenge from that category's session pool.
4. A Sheep player with an unused card of the same category may submit the defense. The first valid eligible defense processed resolves the attack; that player handles the challenge.
5. Participating players or the Host determine whether the challenge succeeded; the Host records the outcome for the active challenge.
6. The Game Engine resolves the score and card-use state, then advances to the next round or result phase.

If no eligible Sheep card remains for the attack category, Sheep cannot defend and the attack resolves under the scoring rules.
