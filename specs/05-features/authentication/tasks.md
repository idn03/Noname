# Player Identity and Session Tasks

## Contract

- [ ] Apply the display-name bounds, duplicate-name policy, lobby admission rules, and credential lifetime consistently across client and server.
- [ ] Define the server-controlled player identity and the client-held credential used to resume it.
- [ ] Ensure the Host role is assigned independently from display names and client payloads.

## Join and Recovery

- [ ] Validate names and lobby availability before creating player state.
- [ ] Bind accepted connections to server-controlled identities and publish authorized lobby updates.
- [ ] Restore an existing identity on valid reconnect without duplicating the player; reject expired or invalid credentials safely.
- [ ] Expire session identity when the game ends or is cancelled.

## Verification

- [ ] Cover identity validation, admission, authorization, disconnect, reconnect, and expiry with automated tests.
- [ ] Verify the join and refresh experience in the browser, including safe feedback for rejected joins.
- [ ] Confirm player credentials never appear in public state or logs.
