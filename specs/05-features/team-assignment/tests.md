# Team Assignment Tests

## Unit and Integration Coverage

- Six players split into two teams of three; ten split into two teams of five.
- Seven and nine players produce valid team sizes with the extra player on either team under controlled randomness.
- Every eligible joining player appears in exactly one team; the Host is in neither team. Six players produce teams of three, and ten players produce teams of five.
- Different controlled random inputs can produce different valid assignments.
- Counts below 6 or above 10 joining players, excluding the Host, and invalid start phases are rejected without changing state.
- Assigned teams remain unchanged through later game phases.

## Browser Flow Coverage

- After the Host starts, every joining player receives their assigned team and the Host receives an observer view; the Host has no team assignment.
- A client refresh restores the server-assigned team rather than creating a new assignment.
