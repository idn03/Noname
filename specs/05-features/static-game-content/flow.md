# Static Game Content Flow

1. The Host loads versioned local category and challenge data through the database layer.
2. The server validates that each challenge belongs to one category and that category content is within its configured limit.
3. Game setup chooses a random subset of no more than 10 challenges per category for the active session.
4. Wolf clients may inspect the available subset during selection; Sheep clients do not receive it before a matching attack is revealed.
5. When a card is revealed, the Game Engine selects an eligible challenge from that category's session pool and avoids repeats while alternatives remain.

Missing or invalid content is reported as a Host-side failure; it is not silently treated as a valid empty challenge pool.
