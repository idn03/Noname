# Turn Gameplay Design

## Goal

Run the finite attack-defense rounds with the server-authoritative Game Engine.

## Active Turn

One attack is active at a time. The Wolf card remains associated with the player who selected it, and only that player may reveal it. A Sheep defense uses a matching unused card in the defending player's own slot. If several Sheep players qualify, the first valid defense processed resolves the attack.

The Sheep player who defends handles the corresponding challenge. The engine owns card-use state, round progression, and domain validation; transport and interface code do not implement these rules.
