export type Team = "wolf" | "sheep";
export type GamePhase = "lobby" | "selection" | "turns" | "results" | "cancelled";

export interface GamePlayer {
  id: string;
  name: string;
  isHost: boolean;
  team?: Team;
  hasCardSlot?: boolean;
  cardCategory?: string;
  cardChallengeId?: string;
  cardSubmitted?: boolean;
  cardUsed?: boolean;
}

export interface GameState {
  phase: GamePhase;
  hostId?: string;
  players: readonly GamePlayer[];
  round: number;
  rounds: number;
  scores: Readonly<Record<Team, number>>;
  selectionStartedAtMs?: number;
  selectionDeadlineMs?: number;
  cardSelection?: {
    categoryIdsByTeam: Readonly<Record<Team, readonly string[]>>;
    challengeIdsByCategory: Readonly<Record<string, readonly string[]>>;
  };
  usedChallengeIds?: readonly string[];
  activeTurn?: ActiveTurn;
  roundHistory?: readonly CompletedRound[];
  winner?: Team | "draw";
}

export interface ActiveTurn {
  round: number;
  attackerId: string;
  attackCategoryId: string;
  attackChallengeId: string;
  defenderId?: string;
  defenseCategoryId?: string;
}

export interface CompletedRound {
  round: number;
  attackerId: string;
  attackCategoryId: string;
  attackChallengeId: string;
  defenderId?: string;
  defenseCategoryId?: string;
  challengeSucceeded?: boolean;
  scoreChange: Readonly<Record<Team, number>>;
}

export type GameCommand =
  | { type: "start"; actorId: string }
  | { type: "cancel"; actorId: string }
  | { type: "select-card"; actorId: string; categoryId: string; challengeId?: string }
  | { type: "remove-card"; actorId: string }
  | { type: "attack"; actorId: string; round: number }
  | { type: "defend"; actorId: string; round: number }
  | { type: "record-challenge-outcome"; actorId: string; round: number; succeeded: boolean };

export function createGameState(players: readonly GamePlayer[]): GameState {
  return {
    phase: "lobby",
    players: players.map(({ id, name, isHost }) => ({ id, name, isHost })),
    round: 0,
    rounds: 0,
    scores: { wolf: 0, sheep: 0 },
    usedChallengeIds: [],
    roundHistory: [],
  };
}
