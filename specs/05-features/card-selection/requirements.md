# Card Selection Requirements

- **CARD-001 — Personal Slot:** Give each player one card slot for their team. Each player may manage only their own slot.
- **CARD-002 — Category Pool:** Provide each team access to one more category than its number of slots. Allow repeated categories within a team.
- **CARD-003 — Draft:** Allow a player to change or clear an unsubmitted local selection.
- **CARD-004 — Submit and Revise:** Done submits the player's selection to the Host. While the Selection Phase remains active, the player may replace or remove it; removal or change requires resubmission.
- **CARD-005 — Phase Gate:** Advance to turn gameplay only after every player has submitted a complete selection. Lock selections after the phase advances.
- **CARD-006 — Challenge Visibility:** Wolf players may inspect available challenges during selection. Sheep clients do not receive Wolf selections before reveal.
- **CARD-007 — Timer:** Set selection duration in minutes equal to the number of card slots. If time expires before all slots are submitted, keep the Selection Phase open until they are complete; do not auto-fill cards or bypass the completion gate.
- **CARD-008 — Validation:** Reject selection commands from another player's slot, invalid categories, or the wrong phase without changing authoritative state.
