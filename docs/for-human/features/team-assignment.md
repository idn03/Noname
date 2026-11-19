# Team Assignment Flow

```mermaid
%%{init: {'themeVariables': {'fontSize': '20px'}, 'flowchart': {'nodeSpacing': 55, 'rankSpacing': 65, 'curve': 'basis'}}}%%
flowchart TD
    A[Host requests start]
    B{Host, lobby, and\nplayer count valid?}
    C[Return error; keep\nlobby unchanged]
    D[Prepare challenge pool\nand initial game state]
    E[Game Engine assigns\nbalanced teams]
    F[Create Host and player\nviews with correct permissions]
    G[Show team-assignment\nphase for 10 seconds]
    H[Assignment deadline reached]
    I[Open card selection\nand start selection timer]

    A --> B
    B -- no --> C
    B -- yes --> D --> E --> F --> G --> H --> I

    classDef step fill:#e9f0f7,stroke:#31536f,stroke-width:2px,color:#142b3d,font-size:20px;
    classDef check fill:#fff2d8,stroke:#876533,stroke-width:2px,color:#3c2c12,font-size:20px;
    class A,C,D,E,F,G,H,I step;
    class B check;
```

`LobbySession.start` validates Host identity, connected joining-player count, and low-population confirmation. `prepareGameSetup` prepares session challenge pools and calls the Game Engine start command, which uses the team-assignment operation. The Host remains an observer; joining players receive teams and card-slot eligibility.

The server holds the assignment phase for ten seconds using an in-memory deadline. The browser renders the current phase and countdown. On completion, the session initializes the card-selection timing window and the view advances to selection. Any setup failure returns an error without publishing a partially assigned match.

The product contract specifies richer roster animation and reconnect timing behavior. Check current view and screen code before relying on those details; the authoritative transition and ten-second deadline are server-side. See [team-assignment specification](../../../specs/05-features/team-assignment/flow.md).
