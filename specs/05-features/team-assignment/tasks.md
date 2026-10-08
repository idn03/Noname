# Team Assignment Tasks

## Assignment Behavior

- [ ] Implement balanced assignment for even and odd player counts, including the Host.
- [ ] Keep randomness isolated from assignment rules so tests can control outcomes.
- [ ] Apply assignment and phase transition as one authoritative operation.
- [ ] Publish the resulting team state to connected clients.

## Verification

- [ ] Cover minimum and maximum player counts, even and odd counts, and both possible odd-count extra teams.
- [ ] Confirm every player is assigned once and assignments stay fixed during the game.
- [ ] Confirm failed starts do not leave partial team state.
