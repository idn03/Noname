# Player Identity and Session Design

## Goal

Let a player join the Host's local game with a display name and retain the same player identity across a browser refresh while the Host session remains active. This feature provides session identity, not account authentication.

## Identity

- The display name is player-facing text, not a unique identifier or credential.
- The server creates an opaque session credential and maps it to a server-controlled player identity after an accepted join.
- The Host role is assigned by the server. A display name, client field, or local UI state cannot grant Host privileges.
- Session credentials are private to the player and server. Do not include them in public player lists, game state broadcasts, or logs.

## Join and Presence

Accept new players only in the lobby and up to the 10-player session limit. The Host counts toward that limit. Disconnected players retain their session place so they can reconnect; only connected players count toward the minimum needed to start. A valid existing identity may reconnect after game start; a new identity may not join a started game. Duplicate display names are allowed.

Trim display names and require 1–24 visible characters. Reject names that are empty after trimming or contain control characters. Duplicate display names are allowed; identity is maintained separately.

## Recovery and Scope

Resume a player only when their credential is valid for the active Host session. Expire identities when the game session ends or is cancelled. Do not promise recovery after the Host process restarts.

V0 does not include accounts, passwords, OAuth, account recovery, Internet identity providers, or persistent player profiles.
