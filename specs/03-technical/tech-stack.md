# Technology Stack

## Frontend

- **Next.js** provides the web application and page rendering.
- **React** builds the user interface.
- **TypeScript** is used for application code.
- **Tailwind CSS** provides utility-based styling.
- **shadcn/ui** supplies reusable interface components.
- **Zustand** manages shared client-side state; server state remains authoritative.

## Backend

- **Node.js** runs the Host server.
- **Socket.IO** carries real-time client and server events.
- **Custom TypeScript Game Engine** owns deterministic game rules and state transitions, independent of UI and persistence.

## Persistence

- **SQLite** stores data that must survive restarts.
- **Drizzle ORM** is the only database access layer.

## Testing

- **Vitest** covers unit and integration tests, with emphasis on Game Engine rules.
- **Playwright** covers end-to-end user flows.
