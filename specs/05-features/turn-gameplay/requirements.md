# Turn Gameplay Requirements

- **TURN-001 — Finite Rounds:** Run the number of rounds established by the team-size rules.
- **TURN-002 — Wolf Attack:** At the start of each round, any Wolf teammate who has not attacked before may initiate the attack using their own unused selected card. That attacker is the only Wolf player to use a card during the round; other Wolf teammates wait until the next round.
- **TURN-003 — Single Active Attack:** Permit only one unresolved attack at a time.
- **TURN-004 — Sheep Defense:** A Sheep player may defend only with an unused card from their own slot whose category matches the active attack.
- **TURN-005 — Competing Defenders:** If multiple Sheep players qualify, accept one defense; the first valid defense processed resolves the attack.
- **TURN-006 — Challenge:** Present the attack card's selected challenge when it has not appeared earlier in the game. If it has appeared, select an unused challenge from that category; repeat only after all alternatives have been used. The defending Sheep player handles the corresponding challenge.
- **TURN-007 — Challenge Outcome:** Participating players or the Host determine success; only the Host records the outcome for the active challenge.
- **TURN-008 — Card Use:** A used attack or defense card cannot be used again during the game.
- **TURN-009 — Challenge Variety:** Avoid repeating a challenge in the same game while alternatives remain.
- **TURN-010 — Validation:** Invalid, stale, wrong-owner, or wrong-phase actions do not change game state. Turn actions must match the active round shown in the authorized game view.
- **TURN-011 — Host Outcome Controls:** While a Sheep player is handling the active challenge, show the Host Thành Công and Thất Bại controls. Only the Host may record one outcome for that active challenge; reject duplicate, stale, or unauthorized outcomes without changing state.
- **TURN-012 — Host Match View:** Show the Host the current round, separate team scores, and the Wolf attack card used in that round. Provide match cancellation through the shared Host footer; do not show a floating X control.
- **TURN-013 — Match History:** Preserve a concise text report of completed rounds, grouped by round and team, including score changes and attack, defense, and challenge outcomes. Make it available to the Host from lobby, selection, and match-management screens.
- **TURN-014 — Sandbox Turns:** Sandbox selects the first unused Wolf slot and first eligible matching Sheep slot in stable player order, submitting each action through the same Game Engine validation as player actions. The Host records each challenge outcome.
