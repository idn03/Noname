# Turn Gameplay Tasks

## Turn Resolution

- [ ] Track active round, attack, participating players, and card-use state in the Game Engine.
- [ ] Enforce Wolf card ownership and one active attack.
- [ ] Enforce matching-category Sheep defense from the defending player's own slot.
- [ ] Resolve a single accepted defense and associate the challenge with that defender.
- [ ] Allow only the Host to record a single outcome for the active challenge.
- [ ] Select challenges without repetition while alternatives remain and advance rounds deterministically.

## Verification

- [ ] Cover valid attacks, invalid owners, duplicate defense attempts, no-match defenses, used cards, and round completion.
- [ ] Keep the rules testable without Socket.IO or browser state.
