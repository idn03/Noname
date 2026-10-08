# Scoring and Results Tasks

## Scoring

- [ ] Implement each score event in the Game Engine from validated attack and defense outcomes.
- [ ] Apply challenge bonus only after a successful defense and successful challenge outcome.
- [ ] Resolve the final result after the configured round count, including draws.
- [ ] Publish score and result state from the Host without accepting client-computed totals.
- [ ] Restrict challenge outcome recording to the Host and apply it once through authoritative server state.

## Verification

- [ ] Cover every scoring outcome, including challenge success and failure, round boundary, win, loss, and draw.
- [ ] Verify clients cannot mutate score or final result.
