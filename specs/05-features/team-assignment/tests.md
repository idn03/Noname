# Team Assignment Tests

## Unit and Integration Coverage

- Six players split into two teams of three; ten split into two teams of five.
- Seven and nine players produce valid team sizes with the extra player on either team under controlled randomness.
- Every eligible player, including the Host, appears in exactly one team.
- Different controlled random inputs can produce different valid assignments.
- Invalid player counts and invalid start phases are rejected without changing state.
- Assigned teams remain unchanged through later game phases.

## Browser Flow Coverage

- After the Host starts, every player receives their assigned team and the same roster state.
- A client refresh restores the server-assigned team rather than creating a new assignment.
