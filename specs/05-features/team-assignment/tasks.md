# Team Assignment Tasks

## Assignment Behavior

- [ ] Implement balanced assignment for joining-player counts; exclude the Host.
- [ ] Keep randomness isolated from assignment rules so tests can control outcomes.
- [ ] Apply assignment and phase transition as one authoritative operation.
- [ ] Publish the resulting team state to connected clients.

## Verification

- [ ] Cover 6–10 joining-player counts, even and odd counts, and both possible odd-count extra teams.
- [ ] Confirm every player is assigned once and assignments stay fixed during the game.
- [ ] Confirm failed starts do not leave partial team state.
