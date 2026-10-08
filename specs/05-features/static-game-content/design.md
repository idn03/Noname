# Static Game Content Design

## Goal

Provide local card categories and challenge text for selection and gameplay without requiring an external service.

## Content Model

Each challenge belongs to exactly one category. Static content is separate from active game state and is available on the Host through the local database. Drizzle ORM is the only database access layer.

## Session Use

At game setup, the Host prepares a random session subset of challenges for each category. Wolf players may inspect the available challenge pool during selection. A challenge is presented only when an attack of its category is revealed.
