# Player invitation QR code in the Web Game

Planned follow-up to the Host terminal QR code. The Host should be able to leave the lobby visible while players scan an invitation from their phones and join over the same Wi-Fi.

## Implementation steps

1. Extend the [player invitation requirement](../../specs/05-features/authentication/requirements.md) to cover the Host lobby. Show the invitation while a regular lobby accepts new players. Follow the existing capacity, game-start, and [Sandbox admission rules](../../specs/05-features/session-management/requirements.md).
2. Resolve the player URL once from the server’s listening interface and port using the [existing invitation helper](../../backend/player-invitation.ts). Supply that value to both the terminal and the Host lobby view. The Host browser often opens on loopback, so its address would send a scanning phone back to itself.
3. Add the invitation to the [Host lobby](../../web-game/features/lobby/ui/components/HostLobbyLayout.tsx). Use the existing `qrcode` package to render a high-contrast, scalable SVG with a clear margin. Display the selectable LAN URL underneath for manual entry. Use Vietnamese labels consistent with the lobby.
4. Handle unavailable invitations. If QR rendering fails, keep the URL visible. If the server has no reachable private IPv4 address, show a short LAN connection message. Keep the roster and Host controls usable in both cases.

## Acceptance checks

- Open the Host lobby through loopback with a custom server port. Decode the displayed QR and verify its URL exactly matches the terminal invitation, including the port.
- Scan the lobby QR with a phone on the same Wi-Fi, enter a name, and confirm it appears in the Host roster. Check scan readability at laptop width and when projected.
- Verify the invitation disappears when the room fills or the game starts, and is absent from Sandbox rooms and player views. Cover the text fallback and missing-address state in UI tests.
