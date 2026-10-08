# Realtime Synchronization Design

## Goal

Keep connected browsers aligned with the Host's authoritative session and game state over the local network.

## State and Views

Clients send intent-based commands. The Host validates and applies each valid command before publishing updates. A player receives only information allowed for that identity and role; private card selections remain server-side until reveal.

On connect or refresh, send a current authorized snapshot. Zustand and other client state may cache that view but never determines game outcomes or phase transitions.
