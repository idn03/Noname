# Card Selection Design

## Goal

Let each player choose and manage the card in their personal team slot before turn gameplay.

## Player Slot

Each player owns one slot. The browser may hold an editable draft locally. The Host server owns submitted selections and slot readiness. A submitted slot may be replaced or removed only while selection remains active.

## Visibility

Wolf players may inspect challenge text during selection. Sheep players may see only the number of available challenges per category, not their text, and must not receive Wolf selections before reveal. The server filters game views; UI hiding alone is not privacy protection.
