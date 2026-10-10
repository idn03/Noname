# Specifications

This directory contains both the provider-agnostic harness contracts and the
product specifications used to guide implementation. The numbered directories
organize product knowledge by subject and lifecycle; feature-specific details
belong under `05-features/<feature>/`.

## Product specification map

- `00-context/` — product overview, shared terminology, and constraints.
- `01-product/` — requirements, business rules, user stories, and quality needs.
- `02-ux/` — application flow, navigation, pages and UI states, design system,
  and [user-facing language](02-ux/language.md).
- `03-technical/` — application architecture, stack, project structure,
  security, and error handling.
  - [`03.1-conventions/coding-conventions.md`](03-technical/03.1-conventions/coding-conventions.md)
    defines shared language, naming, function, and type conventions.
  - [`03.1-conventions/frontend-conventions.md`](03-technical/03.1-conventions/frontend-conventions.md)
    covers React components and client-side state.
  - [`03.1-conventions/gameplay-and-backend-conventions.md`](03-technical/03.1-conventions/gameplay-and-backend-conventions.md)
    covers game logic, Socket.IO, and database access.
  - [`03.1-conventions/testing-conventions.md`](03-technical/03.1-conventions/testing-conventions.md)
    defines test frameworks and test description style.
  - [`03.1-conventions/code-quality-and-maintainability-conventions.md`](03-technical/03.1-conventions/code-quality-and-maintainability-conventions.md)
    covers imports, comments, and general principles.
- `04-backend/` — backend architecture, data, API, authentication, and
  authorization contracts.
- `05-features/` — detailed requirements and verification criteria per feature.
- `06-testing/` — project-wide testing strategy.
- `07-planning/` — roadmap, milestones, and backlog.
- `08-decisions/` — architecture decision records.

The blank files are authoring placeholders. Add content as requirements and
decisions become known; do not treat an empty placeholder as a defined
requirement.

## Harness contracts

These files define the agent workflow and remain authoritative for how work is
planned, executed, checked, and resumed.

## Authority

- `workflow.md` defines lifecycle, ordering, recovery, and safety.
- `contracts.md` defines information exchanged between workflow components.
- `providers.md` defines the provider boundary and adapter obligations.
- `memory.md` defines cross-run knowledge capture and memory precedence.

Human-maintained specifications are the source of truth. Implementations must
not add behavior absent from these documents without updating them.

## Harness contract editing rules

- Keep each specification below 120 lines; prefer below 80.
- Use concise definitions, invariants, and state transitions.
- Do not include source code, pseudo-code, examples, tutorials, or history.
- Do not repeat a rule across specification files.
- Add a file only for a separate, necessary contract.
