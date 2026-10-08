# Player Identity and Session Requirements

This feature defines V0 session identity and joining. It does not provide account authentication.

- **ID-001 — Display Name:** Require a display name when a new player joins. Trim surrounding whitespace; accept 1–24 visible characters and reject empty names or control characters.
- **ID-002 — Non-Unique Names:** Allow duplicate display names. Never use a display name to identify or authorize a player.
- **ID-003 — Server Identity:** After an accepted join, assign a server-controlled player identity and private session credential.
- **ID-004 — Lobby Admission:** Accept new identities only before the game starts and while fewer than 10 player identities belong to the session. Count the Host and disconnected participants toward capacity.
- **ID-005 — Host Authority:** Assign Host privileges on the server. Ignore client claims of Host role or player identity.
- **ID-006 — Connection Binding:** Bind commands to the identity associated with the connection. Reject commands from connections without a valid identity.
- **ID-007 — Reconnection:** A valid credential for the active Host session restores the same player identity and current authorized state without adding a second player.
- **ID-008 — Credential Expiry:** Invalidate session credentials when the game session ends or is cancelled. Do not promise identity recovery after a Host process restart.
- **ID-009 — Presence:** Reflect joins and disconnects in lobby presence for connected clients. Disconnected participants retain their session place; only connected players count toward the minimum needed to start.
- **ID-010 — Safe Feedback:** Report rejected joins and invalid sessions with stable error codes and safe messages; do not expose credentials or implementation details.
- **ID-011 — No Accounts:** Do not require passwords, accounts, OAuth, account recovery, or external identity services in V0.
