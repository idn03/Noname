export type Team = "wolf" | "sheep";
export type GamePhase = "lobby" | "selection" | "turns" | "results" | "cancelled";

export interface GamePlayer {
  id: string;
  name: string;
  isHost: boolean;
  team?: Team;
  cardCategory?: string;
  cardSubmitted?: boolean;
  cardUsed?: boolean;
}

export interface GameState {
  phase: GamePhase;
  players: readonly GamePlayer[];
  round: number;
  rounds: number;
  scores: Readonly<Record<Team, number>>;
  winner?: Team | "draw";
}

export type GameCommand =
  | { type: "start"; actorId: string }
  | { type: "cancel"; actorId: string }
  | { type: "select-card"; actorId: string; category: string }
  | { type: "remove-card"; actorId: string }
  | { type: "attack"; actorId: string }
  | { type: "defend"; actorId: string }
  | { type: "record-challenge-outcome"; actorId: string; succeeded: boolean };

export function createGameState(players: readonly GamePlayer[]): GameState {
  return {
    phase: "lobby",
    players: players.map(({ id, name, isHost }) => ({ id, name, isHost })),
    round: 0,
    rounds: 0,
    scores: { wolf: 0, sheep: 0 },
  };
}
