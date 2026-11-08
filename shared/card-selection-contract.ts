export interface CardChallengeView {
  id: string;
  text: string;
}

export interface CardCategoryView {
  id: string;
  name: string;
  challengeCount: number;
  challenges?: readonly CardChallengeView[];
}

export interface TeamCardReadinessView {
  ready: number;
  total: number;
}

export interface PlayerCardSelectionView {
  phase: 'selection';
  team: 'wolf' | 'sheep';
  hasCardSlot: boolean;
  categories: readonly CardCategoryView[];
  ownCard?: { categoryId: string; challengeId?: string; submitted: boolean };
  score: number;
  teamMembers: readonly { id: string; name: string }[];
  readiness: Readonly<Record<'wolf' | 'sheep', TeamCardReadinessView>>;
  remainingMs: number;
}

export interface HostCardSelectionView {
  phase: 'selection' | 'turns';
  teams: Readonly<Record<'wolf' | 'sheep', {
    players: readonly { id: string; name: string; hasCardSlot: boolean; ready: boolean }[];
    ready: number;
    total: number;
    selectedCategories: readonly string[];
  }>>;
  remainingMs: number;
}

export interface RevealedGameCardView {
  playerId: string;
  team: 'wolf' | 'sheep';
  categoryId: string;
  categoryName: string;
  challengeCount: number;
  challenge?: CardChallengeView;
  used: boolean;
}

export interface ActiveTurnView {
  round: number;
  attackerId: string;
  attackCategoryId: string;
  attackCategoryName: string;
  challenge: CardChallengeView;
  defenderId?: string;
  defenseCategoryId?: string;
}

export interface OwnTurnCardView {
  categoryId: string;
  categoryName: string;
  challenge?: CardChallengeView;
  used: boolean;
  canAttack: boolean;
  canDefend: boolean;
}

export interface CompletedRoundView {
  round: number;
  attackerId: string;
  attackCategoryId: string;
  attackChallengeId: string;
  defenderId?: string;
  defenseCategoryId?: string;
  challengeSucceeded?: boolean;
  scoreChange: Readonly<Record<'wolf' | 'sheep', number>>;
}

export interface FinalResultView {
  scores: Readonly<Record<'wolf' | 'sheep', number>>;
  winner: 'wolf' | 'sheep' | 'draw';
  rounds: number;
  members: Readonly<Record<'wolf' | 'sheep', readonly { id: string; name: string }[]>>;
}

export type LobbyGameView =
  | { phase: 'team-assignment'; role: 'player'; team: 'wolf' | 'sheep'; remainingMs: number }
  | { phase: 'team-assignment'; role: 'host'; remainingMs: number }
  | { phase: 'selection'; role: 'player'; selection: PlayerCardSelectionView }
  | { phase: 'selection'; role: 'host'; selection: HostCardSelectionView }
  | ({ phase: 'results'; role: 'host' | 'player' } & FinalResultView)
  | { phase: 'turns'; role: 'host'; round: number; rounds: number; scores: Readonly<Record<'wolf' | 'sheep', number>>; activeTurn?: ActiveTurnView; roundHistory: readonly CompletedRoundView[]; selection: HostCardSelectionView }
  | { phase: 'turns'; role: 'player'; team?: 'wolf' | 'sheep'; round: number; rounds: number; scores: Readonly<Record<'wolf' | 'sheep', number>>; activeTurn?: ActiveTurnView; ownCard?: OwnTurnCardView; roundHistory: readonly CompletedRoundView[]; revealedCards: readonly RevealedGameCardView[] };
