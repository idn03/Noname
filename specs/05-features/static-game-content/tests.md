# Static Game Content Tests

## Unit and Integration Coverage

- A challenge is accepted only when it belongs to exactly one valid category.
- Category pools at the supported limit are accepted; excess or malformed content is rejected.
- A session exposes no more than 10 challenges per category and selects the subset under controlled randomness.
- Challenge selection never repeats while alternatives remain and permits repeats only after alternatives are exhausted.
- Wolf and Sheep can inspect the session pool during selection; neither team sees the selected challenge for an attack until it is revealed.
- Missing or invalid required content prevents game setup and produces a safe Host-side error.
- Database access remains behind Drizzle and does not enter Game Engine rules.

## Browser Flow Coverage

- Wolf and Sheep can inspect available challenges while choosing a card.
- A matching attack reveals an eligible challenge to the authorized game view.
