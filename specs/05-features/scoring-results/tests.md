# Scoring and Results Tests

## Unit and Integration Coverage

- An undefended attack awards Wolf exactly 2 points.
- A successful defense awards Sheep 1 point; a successful challenge adds exactly 1 point.
- An unsuccessful challenge adds no bonus, and a failed defense does not award Sheep defense points.
- Scores cannot be changed by arbitrary client-provided totals.
- Results are produced only after all configured rounds and correctly represent a win or draw.
- Every connected player's authorized view receives the same score and final result.
- Only the Host can record a challenge outcome; participant or non-Host result submissions are rejected, and a result can be applied only once to the active challenge.

## Browser Flow Coverage

- Players see score updates after resolved turns and the final result after the last round.
- A tie is displayed as a draw.
