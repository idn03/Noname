# Player Identity and Lobby Flow

This page follows the implemented flow from the home screen through lobby start. See the [authentication](../../../specs/05-features/authentication/flow.md) and [session management](../../../specs/05-features/session-management/flow.md) specifications for the full product contract.

```mermaid
%%{init: {'themeVariables': {'fontSize': '20px'}, 'flowchart': {'nodeSpacing': 55, 'rankSpacing': 65, 'curve': 'basis'}}}%%
flowchart TB
    A[Host browser requests room creation]
    B{Connection from loopback?}
    C[Server creates LobbySession\nand Host identity]
    D[Host receives credential\nand lobby view]
    E[Player browser joins by name\nor resumes with credential]
    F[Server binds socket\nto player identity]
    G[Player and Host receive\nrole-filtered lobby views]
    H[Host requests game start]
    I{Host, player count,\nand confirmation valid?}
    J[Game setup begins]
    K[Return safe error;\nkeep lobby unchanged]

    A --> B
    B -- yes --> C --> D --> E --> F --> G --> H --> I
    B -- no --> K
    I -- yes --> J
    I -- no --> K

    classDef step fill:#e9f0f7,stroke:#31536f,stroke-width:2px,color:#142b3d,font-size:20px;
    classDef check fill:#fff2d8,stroke:#876533,stroke-width:2px,color:#3c2c12,font-size:20px;
    class A,C,D,E,F,G,H,J,K step;
    class B,I check;
```

1. The home page renders `LobbyScreen`, which uses lobby hooks to open Socket.IO and show connection, identity, and lobby state.
2. A local browser can request Host creation. The server accepts it only from a loopback connection, creates a `LobbySession`, then issues a Host identity and credential.
3. A player joins with a display name, or resumes using the credential presented at connection time. The server binds the socket to the resulting identity and returns a role-filtered view.
4. The lobby tracks connected and disconnected participants. A reconnect restores a participant while the in-memory session remains alive.
5. The Host starts the match. The server checks Host authority, player count and any low-population confirmation before game setup.

The credential is held by the browser in `localStorage`; it is not a player account. Live room data is in memory, so a Host restart ends the session. See [Realtime updates](content-and-realtime.md) for snapshot delivery.
