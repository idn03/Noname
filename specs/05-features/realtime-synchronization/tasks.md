# Realtime Synchronization Tasks

## Transport and Views

- [ ] Define typed client commands and server updates using the backend API contract.
- [ ] Bind each connection to its server-controlled player identity.
- [ ] Validate commands before invoking application services or the Game Engine.
- [ ] Publish post-transition snapshots and events with role-aware filtering.
- [ ] Restore an authorized snapshot on connect or refresh and preserve state on disconnect.

## Verification

- [ ] Cover accepted, rejected, duplicate, stale, and unauthorized commands.
- [ ] Verify hidden selections are absent from unauthorized payloads.
- [ ] Verify refresh, disconnect, reconnect, and safe error handling.
