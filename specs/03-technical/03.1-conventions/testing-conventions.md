# Testing Conventions

## Testing

Use Vitest for unit and integration tests.

Use Playwright for end-to-end tests.

Game Engine rules should receive the highest unit-test coverage.

Tests should describe behavior rather than implementation details.

Prefer:

```text
awards two points when an attack is not defended
```

over:

```text
calls updateScore with 2
```
