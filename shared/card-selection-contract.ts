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
}

export type LobbyGameView =
  | { phase: 'selection'; role: 'player'; selection: PlayerCardSelectionView }
  | { phase: 'selection'; role: 'host'; selection: HostCardSelectionView }
  | { phase: 'turns'; role: 'host'; round: number; rounds: number; selection: HostCardSelectionView }
  | { phase: 'turns'; role: 'player'; team?: 'wolf' | 'sheep'; round: number; rounds: number; revealedCards: readonly RevealedGameCardView[] };
