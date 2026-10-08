# Static Game Content Requirements

- **DATA-001 — Local Content:** Provide predefined categories and challenges from local Host storage; no external content service is required.
- **DATA-002 — Category Ownership:** Assign every challenge to exactly one category.
- **DATA-003 — Content Limits:** Support up to 50 predefined challenges in a category and expose no more than 10 per category in one game session.
- **DATA-004 — Random Subset:** Select a session challenge subset using isolated randomness that can be controlled in tests.
- **DATA-005 — No Repeats:** Avoid repeating a challenge in one game while alternatives remain in that category's session pool.
- **DATA-006 — Privacy:** Make challenge pools available to Wolf during selection and reveal a challenge to all permitted players only when its attack occurs.
- **DATA-007 — Persistence:** Keep static content separate from live game state; access SQLite only through Drizzle ORM.
- **DATA-008 — Invalid Content:** Report missing or malformed required content safely and prevent invalid game setup.
