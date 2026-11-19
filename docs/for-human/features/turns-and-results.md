# Turns and Results Flow

```mermaid
%%{init: {'themeVariables': {'fontSize': '20px'}, 'flowchart': {'nodeSpacing': 55, 'rankSpacing': 65, 'curve': 'basis'}}}%%
flowchart TB
    A[Wait for eligible Wolf attack]
    B{Matching unused Sheep\ncard available?}
    C[Wait for eligible Sheep defense]
    D[Host records challenge\noutcome once]
    E[Resolve score, card use,\nand round history]
    F{More rounds remain?}
    G[Start next round]
    H[Calculate winner or draw\nand publish results]

    A -->|Wolf attacks| B
    B -->|yes| C -->|Sheep defends| D --> E
    B -->|no| E
    E --> F
    F -->|yes| G --> A
    F -->|no| H

    classDef step fill:#e9f0f7,stroke:#31536f,stroke-width:2px,color:#142b3d,font-size:20px;
    classDef check fill:#fff2d8,stroke:#876533,stroke-width:2px,color:#3c2c12,font-size:20px;
    class A,C,D,E,G,H step;
    class B,F check;
```

The Game Engine accepts turn commands only in the turns phase. An attack must match the active round and come from a Wolf with an unused submitted card. The engine chooses an unused challenge from the category pool where possible. A Sheep player can defend only with an unused submitted card in the same category. If no eligible defense exists, the round resolves as an undefended attack. Otherwise the Host records the challenge outcome once.

The engine records card use, score changes, round history, and the next round. An undefended attack gives Wolf two points; a defended challenge gives Sheep one point, plus one more when successful. After the last round it sets the results phase and winner or draw. Server views carry the active turn, team-appropriate data, scores, history, and result. `LobbyScreen` selects the player/Host turn screens and the end-game screen from those views.

Turn commands and screens exist in source. Verify the current client interactions against the [turn gameplay](../../../specs/05-features/turn-gameplay/flow.md) and [scoring/results](../../../specs/05-features/scoring-results/flow.md) contracts before changing them.
