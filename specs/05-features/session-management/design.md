# Session Management Design

## Goal

Provide one Host-controlled game session on the Host machine. The Host participates as a regular player and has only the session controls defined by V0.

## Session States

The session accepts new players in the lobby, becomes a game when the Host starts it, and ends when the game completes or the Host cancels it. Only one session may be active at a time.

## Authority

The server decides whether the Host may start or cancel, whether the player count is valid, and which phase is active. The client displays this state and submits Host intentions; it does not change the phase locally.

Detailed admission and player identity rules are in [authentication](../authentication/requirements.md). Game phase rules are in [business rules](../../01-product/business-rules.md).
