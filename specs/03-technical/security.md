# Security

## Trust and Network Boundary

V0 targets a trusted LAN or Wi-Fi group. The Host server is authoritative; treat clients as untrusted for every game-changing operation. Do not expose the app directly to the public Internet without a separate security review and requirements for authentication, transport security, rate limiting, and infrastructure hardening.

Bind the server only to interfaces needed for local access.

## Validation and Authorization

Validate all external input at runtime before use, including Socket.IO payloads, route parameters, forms, names, identifiers, enum values, and database-bound values. TypeScript types do not replace runtime validation. Reject malformed or unsupported input.

Authorize every game-changing action on the server against connection identity, permissions, and current game state. Players act only for themselves and use only cards they own; turn actions must match the active player or team. Host-only operations must use server-controlled Host status. Never trust client values for score, team, turn order, phase, card ownership, challenge results, or roles.

Each connected player must have a server-controlled session identity. Names are display data, not security identifiers. Unknown or unsupported events must not change state.

## State and Privacy

Keep authoritative game state on the server. Send each client only information it may observe; never rely on the UI to hide unrevealed cards, private selections, hidden challenge data, or unpublished randomization results.

Collect and store only data needed for gameplay and operation. Do not store passwords, authentication secrets, or sensitive personal data unless a future specification requires them.

## Database, Errors, and Secrets

Clients must not access SQLite. Route database access through the server and Drizzle ORM; never build SQL from raw user input. Do not expose database paths, SQL, schema internals, raw errors, stack traces, environment variables, filesystem paths, or other implementation details. Follow [error-handling.md](./error-handling.md) for client errors.

Never commit secrets. Use environment variables for non-public configuration, and keep example configuration (such as `.env.example`) free of real secrets.

## Application and Dependency Safety

Treat player-provided text as untrusted: do not render it as raw HTML without proper sanitization, or execute it as code or expressions.

Use maintained packages from trusted sources. Avoid unnecessary dependencies, keep them reasonably current, and review security advisories before major upgrades or releases.

The server should tolerate repeated or abusive requests. Bound user-controlled input and prevent a single client from causing unbounded memory use, database writes, timers, or broadcast payloads. V0 does not require advanced rate limiting.

Log security-relevant failures when useful, without recording unnecessary sensitive data.

## Out of Scope for V0

Internet-facing authentication, TLS certificate management, OAuth, account recovery, distributed authorization, advanced anti-cheat, and enterprise threat detection require separate specifications. These limits do not make client input trustworthy.
