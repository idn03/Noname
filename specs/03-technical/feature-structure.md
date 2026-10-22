# Feature Structure

Organize each browser feature by responsibility while keeping feature behavior local to its feature.

## Directories

- **`ui/screen/`** contains route-level or feature-level screens. Screens compose UI and consume hooks; keep state transitions, transport calls, and derived workflow decisions in hooks or domain services.
- **`ui/components/`** contains feature-specific presentational components. Components own markup, styling hooks, accessibility, and narrowly scoped interaction; reusable application-wide components belong in `web-game/components/`.
- **`hooks/`** contains feature-specific React hooks for stateful behavior, effects, transport coordination, and workflow actions. Keep game rules in the game domain and keep pure utilities in appropriately named modules rather than disguising them as hooks.
- **`services/`** contains feature-specific operations that coordinate external systems when they do not belong in a hook.
- **`types/`** contains feature-specific types that are shared across multiple feature modules and do not belong in an existing contract or domain module.

Create only directories a feature needs. Keep modules inside their owning feature unless they are genuinely reused across features. Avoid unnecessary barrel files.

## Dependencies

Screens may compose feature UI and call feature hooks. Feature UI may depend on shared application components and feature types. Hooks and services may depend on browser shared contracts and game-domain APIs, but game rules must remain independent of React and transport.
