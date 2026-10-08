# Static Game Content Tasks

## Content and Session Pools

- [ ] Define and maintain local categories and predefined challenge content.
- [ ] Validate category relationships and per-category content limits.
- [ ] Load content through Drizzle and keep it separate from live session state.
- [ ] Prepare a controlled-random session subset of at most 10 challenges per category.
- [ ] Enforce role-aware challenge visibility and no-repeat selection while alternatives remain.

## Verification

- [ ] Cover empty, maximum-size, malformed, and valid category pools.
- [ ] Verify controlled randomness, subset bounds, visibility, and challenge non-repetition.
