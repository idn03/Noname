import type { LobbyPlayerView, LobbyView } from '../shared/lobby-contract';
import type { GameState } from '../web-game/game/game-types';
import type { LobbyGameView } from '../shared/card-selection-contract';
import type { SessionCategoryPool } from './db/session-pool';
import { createHostCardSelectionView, createPlayerCardSelectionView } from './card-selection-view';
import { activeTurnView, ownTurnCard, revealedCards } from './turn-view';

export function createLobbyView(
  phase: LobbyView['phase'],
  players: readonly LobbyPlayerView[],
  gameState?: GameState,
  viewerId?: string,
  pools: readonly SessionCategoryPool[] = [],
  now = Date.now(),
  assignmentDeadlineMs?: number,
): LobbyView {
  const teams = new Map(gameState?.players.map(({ id, team }) => [id, team]));
  const viewer = players.find((player) => player.id === viewerId);
  const hostViewer = viewer?.isHost === true;
  const hostId = players.find((player) => player.isHost)?.id;
  const game = gameState && viewer && hostId
    ? assignmentDeadlineMs && assignmentDeadlineMs > now
      ? assignmentView(gameState, viewer, assignmentDeadlineMs - now)
      : authorizedGameView(gameState, pools, hostId, viewer, now)
    : undefined;
  return {
    phase,
    ...(game ? { game } : {}),
    players: players.map(({ id, name, isHost, connected }) => {
      const team = teams.get(id);
      return { id, name, isHost, connected, ...(team && (hostViewer || id === viewerId) ? { team } : {}) };
    }),
  };
}

function assignmentView(state: GameState, viewer: LobbyPlayerView, remainingMs: number): LobbyGameView | undefined {
  if (!viewer.isHost) {
    const team = state.players.find(({ id }) => id === viewer.id)?.team;
    return team ? { phase: 'team-assignment', role: 'player', team, remainingMs } : undefined;
  }
  return { phase: 'team-assignment', role: 'host', remainingMs };
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
    if (viewer.isHost) {
      const selection = createHostCardSelectionView(state, pools, hostId, viewer.id, now);
      return selection.ok ? {
        phase: 'turns', role: 'host', round: state.round, rounds: state.rounds, scores: state.scores,
        ...(activeTurnView(state, pools) ? { activeTurn: activeTurnView(state, pools) } : {}),
        roundHistory: state.roundHistory ?? [], selection: selection.value,
      } : undefined;
    }
    const team = teamsForViewer(state, viewer.id);
    const ownCard = ownTurnCard(state, pools, viewer.id);
    return {
      phase: 'turns', role: 'player',
      ...(team ? { team } : {}),
      round: state.round, rounds: state.rounds, scores: state.scores,
      ...(activeTurnView(state, pools) ? { activeTurn: activeTurnView(state, pools) } : {}),
      ...(ownCard ? { ownCard } : {}), roundHistory: state.roundHistory ?? [],
      revealedCards: revealedCards(state, pools),
    };
  }
  return undefined;
}

function teamsForViewer(state: GameState, viewerId: string): 'wolf' | 'sheep' | undefined {
  return state.players.find((player) => player.id === viewerId)?.team;
}
