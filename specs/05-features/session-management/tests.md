# Session Management Tests

## Unit and Integration Coverage

- Start is accepted for the Host with 6–10 connected players and rejected below 6 or above 10.
- Non-Host start and cancel requests are rejected without changing the session.
- Start is rejected outside the lobby; cancellation is rejected when no session is active.
- A valid cancellation ends the session, clears active game state, and publishes cancellation.
- A failed operation leaves session state unchanged.

## Browser Flow Coverage

- The Host can start a valid lobby and sees the game phase update.
- Players receive the same cancellation notice when the Host cancels.
- A non-Host client does not see usable Host controls or gain Host authority through client input.
