# Error Handling

## Error Categories

- **Domain:** a valid request that violates a game or application rule. Handle as an expected outcome, not a server failure.
- **Validation:** malformed or unsupported external input. Reject before it reaches core logic.
- **System:** unexpected technical failure. Log on the Host server and return a safe generic response.

## Client Contract

Client-facing errors use stable codes; client behavior must not depend on message text. Use a consistent shape with a code and human-readable message. Include context only when safe. Never return raw errors, stack traces, or implementation details.

Expected errors should have understandable messages. Unexpected failures should use a generic fallback. Database and other infrastructure errors must be translated to application-level errors.

## Game and Socket.IO Operations

The Game Engine must report predictable domain errors for invalid actions. Each Socket.IO command must validate its payload, player permission, and current game state before executing. Handle expected domain errors explicitly; log unexpected failures and return a safe response. Invalid requests must not crash the server or terminate other sessions.

Validate all conditions before mutating authoritative state. Treat dependent mutations as one logical operation; a failed operation or persistence write must not leave state partially updated or silently inconsistent.

## Logging and Recovery

Log unexpected errors on the Host server with useful context, such as error code, operation, and game or room identifier. Avoid unnecessary private player data and complete database records.

Allow retry after recoverable failures. Preserve the current session where possible. A single invalid request must not end a game, server, or other player connection.

## Prohibited

- Empty `catch` blocks or ignored rejected promises.
- Raw errors or arbitrary message text used as application logic.
- Exposing SQL, database paths or internals, stack traces, or raw exceptions to clients.
- Treating expected domain errors as internal server failures.
- Mutating game state before validation completes.
