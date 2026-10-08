# Realtime Synchronization Flow

1. A browser connects to the Host and presents its session identity.
2. The server validates the connection and returns that player's current authorized snapshot.
3. The client submits an intent through the defined Socket.IO contract.
4. The server validates payload, identity, permissions, and phase; it rejects invalid commands without mutation.
5. The server applies a valid transition and publishes authorized updates to affected connected clients.
6. On disconnect, the server updates presence without corrupting game state. A valid reconnect receives a fresh snapshot.

Clients treat command responses and server updates as authoritative and do not predict successful state changes.
