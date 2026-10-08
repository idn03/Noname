# Session Management Tasks

## Session Behavior

- [ ] Represent the lobby, active game, completed session, and cancelled session consistently with the Game Engine phases.
- [ ] Enforce the one-session and connected-player start gates on the Host.
- [ ] Enforce server-designated Host permissions for start and cancellation.
- [ ] Notify connected clients and clear active state after cancellation.

## Verification

- [ ] Cover valid and invalid start/cancel operations and player-count boundaries.
- [ ] Verify cancellation is synchronized to all connected clients.
- [ ] Confirm Host participation does not bypass gameplay rules.
