import { gameError, type GameResult } from '../web-game/game/game-error';
import type { GamePlayer, GameState, Team } from '../web-game/game/game-types';
import type { SessionCategoryPool } from './db/session-pool';

interface SelectionCategoryView {
  id: string;
  name: string;
  challengeCount: number;
  challenges?: readonly { id: string; text: string }[];
}

export interface PlayerCardSelectionView {
  phase: 'selection';
  team: Team;
  hasCardSlot: boolean;
  categories: readonly SelectionCategoryView[];
  ownCard?: { categoryId: string; challengeId?: string; submitted: boolean };
  remainingMs: number;
}

export interface HostCardSelectionView {
  phase: 'selection';
  teams: Readonly<Record<Team, {
    players: readonly { id: string; name: string; hasCardSlot: boolean; ready: boolean }[];
    ready: number;
    total: number;
  }>>;
  remainingMs: number;
}

export function createPlayerCardSelectionView(
  state: GameState,
  pools: readonly SessionCategoryPool[],
  playerId: string,
  now = Date.now(),
): GameResult<PlayerCardSelectionView> {
  if (state.phase !== 'selection' || !state.cardSelection || state.selectionDeadlineMs === undefined) {
    return gameError('INVALID_PHASE', 'Card selection is not active.');
  }
  const player = state.players.find(({ id }) => id === playerId);
  if (!player || player.isHost || !player.team) return gameError('NOT_AUTHORIZED', 'Player selection access is required.');
  const team = player.team;
  const hasCardSlot = player.hasCardSlot === true;
  const categoryIds = hasCardSlot ? state.cardSelection.categoryIdsByTeam[team] : [];
  const categories = categoryIds.map((id) => playerCategoryView(id, team, pools, state));
  if (categories.some((category) => !category)) return gameError('INVALID_INPUT', 'Selection category content is unavailable.');
  return {
    ok: true,
    value: {
      phase: 'selection', team, hasCardSlot,
      categories: categories as SelectionCategoryView[],
      ...(hasCardSlot && player.cardCategory ? { ownCard: ownCardView(player) } : {}),
      remainingMs: Math.max(0, state.selectionDeadlineMs - now),
    },
  };
}

export function createHostCardSelectionView(
  state: GameState,
  hostId: string,
  viewerId: string,
  now = Date.now(),
): GameResult<HostCardSelectionView> {
  if (viewerId !== hostId) return gameError('NOT_AUTHORIZED', 'Only the Host can view selection progress.');
  if (state.phase !== 'selection' || !state.cardSelection || state.selectionDeadlineMs === undefined) {
    return gameError('INVALID_PHASE', 'Card selection is not active.');
  }
  const participants = state.players.filter((player) => !player.isHost);
  const teams = { wolf: hostTeamView(participants, 'wolf'), sheep: hostTeamView(participants, 'sheep') };
  return { ok: true, value: { phase: 'selection', teams, remainingMs: Math.max(0, state.selectionDeadlineMs - now) } };
}

function hostTeamView(players: readonly GamePlayer[], team: Team): HostCardSelectionView['teams'][Team] {
  const roster = players.filter((player) => player.team === team).map(hostRosterPlayer);
  return {
    players: roster,
    ready: roster.filter(({ ready }) => ready).length,
    total: roster.filter(({ hasCardSlot }) => hasCardSlot).length,
  };
}

function playerCategoryView(id: string, team: Team, pools: readonly SessionCategoryPool[], state: GameState): SelectionCategoryView | undefined {
  const pool = pools.find((candidate) => candidate.categoryId === id);
  const ids = state.cardSelection?.challengeIdsByCategory[id];
  if (!pool || !ids) return undefined;
  const challenges = pool.challenges.filter(({ id: challengeId }) => ids.includes(challengeId));
  return {
    id, name: pool.categoryName, challengeCount: challenges.length,
    ...(team === 'wolf' ? { challenges } : {}),
  };
}

function ownCardView(player: GamePlayer): NonNullable<PlayerCardSelectionView['ownCard']> {
  return {
    categoryId: player.cardCategory ?? '',
    ...(player.team === 'wolf' && player.cardChallengeId ? { challengeId: player.cardChallengeId } : {}),
    submitted: player.cardSubmitted === true,
  };
}

function hostRosterPlayer(player: GamePlayer): HostCardSelectionView['teams'][Team]['players'][number] {
  const complete = player.cardSubmitted === true && Boolean(player.cardCategory)
    && (player.team !== 'wolf' || Boolean(player.cardChallengeId));
  return {
    id: player.id, name: player.name, hasCardSlot: player.hasCardSlot === true,
    ready: player.hasCardSlot === true && complete,
  };
}
