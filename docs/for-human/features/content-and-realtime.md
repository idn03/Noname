# Game Content and Realtime Update Flow

```mermaid
%%{init: {'themeVariables': {'fontSize': '20px'}, 'flowchart': {'nodeSpacing': 55, 'rankSpacing': 65, 'curve': 'basis'}}}%%
flowchart TB
    subgraph CONTENT[Content preparation at startup]
        direction LR
        Bundled[Bundled categories\nand challenges]
        Seed[Migration and seed]
        DB[(SQLite\nvia Drizzle)]
        Validate[Load and validate]
        Setup[Build session\nchallenge pools]
        Bundled --> Seed --> DB --> Validate --> Setup
    end

    Engine[Game Engine consumes\nsession pools]
    Setup --> Engine

    subgraph REALTIME[Realtime command and update]
        direction LR
        Browser[Browser]
        Handler[Socket.IO\nhandler]
        Session[Validate and update\nLobbySession]
        View[Build authorized\nsnapshot]
        Browser -->|command| Handler --> Session --> View
        View -->|updated view| Browser
    end

    classDef step fill:#e9f0f7,stroke:#31536f,stroke-width:2px,color:#142b3d,font-size:20px;
    classDef storage fill:#f8efe0,stroke:#876533,stroke-width:2px,color:#3c2c12,font-size:20px;
    class Bundled,Seed,Validate,Setup,Engine,Browser,Handler,Session,View step;
    class DB storage;
```

At startup, `openContentDatabase` opens `.data/noname.db`, applies Drizzle migrations, seeds bundled rows, and loads validated categories and challenges. Game setup derives session pools from this content. The database stores content, not active player/session/game state.

Socket.IO handlers bind each connection to a server-side identity. On join or resume they return a current view; on valid commands they update the session and publish new views. Each view is generated for its recipient, so a client does not receive information hidden in its current role or phase. Disconnection changes presence; reconnect can recover from the running Host session using the browser credential. Ending a room clears the credentials and active session.

This is one in-process Host; there is no separate database server or multi-node synchronization. See [static content](../../../specs/05-features/static-game-content/flow.md) and [realtime synchronization](../../../specs/05-features/realtime-synchronization/flow.md).
