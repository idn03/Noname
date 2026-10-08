# Backend API Contracts

## Transport

Socket.IO is the V0 real-time transport between browsers and the Host. Clients send intent-based commands; the server publishes authoritative state changes and safe errors. Centralize event names and define typed contracts for both directions.

## Client Commands

Commands cover joining with a display name, requesting the current session view, Host start and cancel actions, selecting, replacing, or removing the connected player's own card slot, revealing that player's own Wolf card, Sheep defense with that player's own matching card, and Host recording the outcome of the active challenge. Each command identifies the requested operation and carries only the data needed for that operation. The server derives player identity from the connection session, never from a client-supplied player identifier.

Validate payload shape, bounds, enum values, session membership, authorization, and current game phase before mutation. Reject unknown events and stale or invalid actions without changing state. Clients cannot submit authoritative scores, teams, turns, ownership, phase, or challenge outcomes as trusted values.

## Server Updates

Publish lobby presence and player-list changes, game phase transitions, each player's authorized game view, scoring changes, cancellation, and final results. Send a current authorized snapshot after connection or reconnection. 

Do not broadcast hidden team selections, unrevealed cards, or private challenge data to clients that may not see them.

## Errors

Return expected failures using the stable error code and human-readable message contract in [error-handling.md](../03-technical/error-handling.md). 

Clients must branch on codes rather than message text. 

Unexpected failures use a generic client response and are logged on the Host. Never expose stack traces, SQL, filesystem paths, or raw exceptions.

## Consistency

Apply each accepted command as one logical operation and publish updates only after the authoritative transition succeeds. Clients render server-provided state and do not infer that an action succeeded until they receive its result or a subsequent state update.
