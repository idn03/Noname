# Card Selection Requirements

- **CARD-001 — Personal Slot:** Give each team the same number of card slots as the smaller team has members. If team sizes differ, designate one member of the larger team without a slot; they cannot select a card and do not count toward readiness. Each other player may manage only their own slot.
- **CARD-002 — Category Pool:** Randomly provide each team access to one more category than its number of slots. Team category access may overlap. Allow repeated categories within a team.
- **CARD-003 — Draft:** Allow a player to change or clear an unsubmitted local selection.
- **CARD-004 — Submit and Revise:** Done submits the player's selection to the Host. A submitted selection locks the card carousel. While the Selection Phase remains active, the player may remove it with “Bỏ chọn,” then browse and submit a replacement.
- **CARD-005 — Phase Gate:** Advance to turn gameplay only after every card slot has a complete submitted selection. Lock selections after the phase advances.
- **CARD-006 — Challenge Visibility:** During selection, Wolf players may inspect challenge text and Sheep players may see only the number of available challenges per category. Sheep clients do not receive challenge text or Wolf selections before reveal.
- **CARD-012 — Reveal:** During selection, show submitted category names to the Host but keep Wolf selections hidden from Sheep and challenge text hidden from the Host. Once every slot is complete, reveal the selected cards and Wolf challenge text to players; the Host continues to see category tags without card faces or challenge text.
- **CARD-013 — Sandbox Transition:** After Sandbox selections are filled, keep the Host on the completed selection view for 10 seconds before opening match management. Do not accept turn actions during this presentation delay.
- **CARD-007 — Timer:** Set selection duration in minutes equal to the card slots per team. If time expires before all slots are submitted, keep the Selection Phase open until they are complete; do not auto-fill cards or bypass the completion gate.
- **CARD-008 — Validation:** Reject selection commands from another player's slot, invalid categories, a Wolf challenge already selected by a teammate in that category, or the wrong phase without changing authoritative state. Wolf teammates may select the same category when they choose different challenges.
- **CARD-009 — Host Progress View:** Show the Host both team rosters, readiness, and submitted category names. Do not reveal challenge text before selection completes.
- **CARD-010 — Host Team Overview:** During selection, show the Host both team rosters, selected-card counts, and remaining time.
- **CARD-011 — Sandbox Defaults:** In Sandbox, automatically select Music for every Wolf slot and choose a random available challenge. Fill Sheep slots with the repeating category sequence Music, Music, Travel until all slots are filled.
