# Card Selection Flow

```mermaid
%%{init: {'themeVariables': {'fontSize': '20px'}, 'flowchart': {'nodeSpacing': 55, 'rankSpacing': 65, 'curve': 'basis'}}}%%
flowchart TB
    A[Player edits local card draft]
    B[Submit category\nand optional Wolf challenge]
    C[Socket handler checks identity\nand request shape]
    D[LobbySession checks player\nand active phase]
    E[Game Engine validates\nand applies selection]
    F{Valid command?}
    G[Store next authoritative state]
    H[Return domain error;\nstate stays unchanged]
    I[Build role-filtered views\nand broadcast snapshot]
    J{All card slots complete?}
    L[Advance to turns; reveal\npermitted card details]
    K[Player may remove submitted card\nand choose again while open]

    A --> B --> C --> D --> E --> F
    F -- yes --> G --> I --> J
    F -- no --> H
    J -- yes --> L
    J -- no --> K --> A

    classDef step fill:#e9f0f7,stroke:#31536f,stroke-width:2px,color:#142b3d,font-size:20px;
    classDef check fill:#fff2d8,stroke:#876533,stroke-width:2px,color:#3c2c12,font-size:20px;
    class A,B,C,D,E,G,H,I,J,L,M step;
    class F,K check;
```

After team assignment, player views receive categories allowed for their team and their own slot state. Wolf views include challenge choices; Sheep views expose only challenge counts. The Host sees submitted categories and readiness, not challenge text. A slotless player is shown a waiting state.

The player edits a local draft in the card-selection UI. Submit and remove commands go through Socket.IO and are validated by the server and Game Engine. Submitted slots can be removed and replaced while selection remains active. The Game Engine advances to turns only when all card slots are complete; timer expiration does not auto-fill a slot. When the phase advances, authorized views expose the selected cards and challenge details.

The code contains this full server transition and UI selection flow. See [card-selection specification](../../../specs/05-features/card-selection/flow.md) for privacy and timer invariants.
