# Authentication

## V0 Identity Model

V0 has no player accounts, passwords, OAuth, or public identity provider. A player enters a display name to join. The server issues an opaque session identity for the connection and associates it with the player record for the active session. Display names are labels, not authentication credentials or unique security identifiers.

The Host role is assigned by the server to the Host session. A client cannot claim Host status by changing a display name, payload, or local state.

## Session Handling

Bind commands to the server-controlled identity associated with the Socket.IO connection. Do not accept a player identity from command payloads as proof of identity. Keep session credentials scoped to the local game session and avoid logging or broadcasting them.

On reconnect, restore the same player identity only when the presented session credential is valid for the active session. Otherwise require the player to join again. A browser refresh must not create a second player when the original session can be resumed.

## Scope

This model supports trusted LAN or Wi-Fi play only. Internet-facing accounts, credential recovery, identity verification, and transport security require separate product and security requirements.
