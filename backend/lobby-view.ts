import type { LobbyPlayerView, LobbyView } from '../shared/lobby-contract';
import type { GameState } from '../web-game/game/game-types';
import type { LobbyGameView, RevealedGameCardView } from '../shared/card-selection-contract';
import type { SessionCategoryPool } from './db/session-pool';
import { createHostCardSelectionView, createPlayerCardSelectionView } from './card-selection-view';

export function createLobbyView(
  phase: LobbyView['phase'],
  players: readonly LobbyPlayerView[],
  gameState?: GameState,
  viewerId?: string,
  pools: readonly SessionCategoryPool[] = [],
  now = Date.now(),
): LobbyView {
  const teams = new Map(gameState?.players.map(({ id, team }) => [id, team]));
  const viewer = players.find((player) => player.id === viewerId);
  const hostViewer = viewer?.isHost === true;
  const hostId = players.find((player) => player.isHost)?.id;
  const game = gameState && viewer && hostId ? authorizedGameView(gameState, pools, hostId, viewer, now) : undefined;
  return {
    phase,
    ...(game ? { game } : {}),
    players: players.map(({ id, name, isHost, connected }) => {
      const team = teams.get(id);
      return { id, name, isHost, connected, ...(team && (hostViewer || id === viewerId) ? { team } : {}) };
    }),
  };
}

function authorizedGameView(
  state: GameState,
  pools: readonly SessionCategoryPool[],
  hostId: string,
  viewer: LobbyPlayerView,
  now: number,
): LobbyGameView | undefined {
  if (state.phase === 'selection') {
    if (viewer.isHost) {
      const selection = createHostCardSelectionView(state, pools, hostId, viewer.id, now);
      return selection.ok ? { phase: 'selection', role: 'host', selection: selection.value } : undefined;
    }
    const selection = createPlayerCardSelectionView(state, pools, viewer.id, now);
    return selection.ok ? { phase: 'selection', role: 'player', selection: selection.value } : undefined;
  }
  if (state.phase === 'turns') {
    const team = teamsForViewer(state, viewer.id);
    return {
      phase: 'turns', role: viewer.isHost ? 'host' : 'player',
      ...(team ? { team } : {}),
      round: state.round, rounds: state.rounds, revealedCards: revealedCards(state, pools),
    };
  }
  return undefined;
}

function revealedCards(state: GameState, pools: readonly SessionCategoryPool[]): RevealedGameCardView[] {
  return state.players.flatMap((player) => {
    if (player.isHost || !player.team || !player.cardSubmitted || !player.cardCategory) return [];
    const category = pools.find((pool) => pool.categoryId === player.cardCategory);
    if (!category) return [];
    const challenge = player.team === 'wolf'
      ? category.challenges.find(({ id }) => id === player.cardChallengeId)
      : undefined;
    return [{
      playerId: player.id, team: player.team, categoryId: category.categoryId, categoryName: category.categoryName,
      challengeCount: category.challenges.length,
      ...(challenge ? { challenge: { id: challenge.id, text: challenge.text } } : {}),
    }];
  });
}

function teamsForViewer(state: GameState, viewerId: string): 'wolf' | 'sheep' | undefined {
  return state.players.find((player) => player.id === viewerId)?.team;
}
