# Turn Gameplay Flow

1. The Game Engine begins the next round and awaits an unused card from any Wolf player who has not attacked earlier in the game.
2. The first such player to attack reveals their own card and includes the displayed round number. The server validates the round, ownership, availability, phase, and that no other attack is active. Other Wolf teammates wait until the next round.
3. The server reveals the card's selected challenge if unused; otherwise, it chooses an unused challenge from that category's session pool. It repeats a challenge only after all alternatives have been used.
4. A Sheep player with an unused card of the same category may submit the defense with the displayed round number. The first valid eligible defense processed resolves the attack; that player handles the challenge.
5. Participating players or the Host determine whether the challenge succeeded; the Host records the active challenge outcome with Thành Công or Thất Bại and its round number. Only one outcome is accepted.
6. The Game Engine resolves the score and card-use state, then advances to the next round or result phase.

If no eligible Sheep card remains for the attack category, Sheep cannot defend and the attack resolves under the scoring rules.

In Sandbox, the first unused Wolf slot and first eligible matching Sheep slot in stable player order submit actions through the same engine commands. The Host records challenge outcomes.
