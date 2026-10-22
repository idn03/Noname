import type { LobbyPlayerView, LobbyView } from '../shared/lobby-contract';
import type { GameState } from '../web-game/game/game-types';

export function createLobbyView(
  phase: LobbyView['phase'],
  players: readonly LobbyPlayerView[],
  gameState?: GameState,
  viewerId?: string,
): LobbyView {
  const teams = new Map(gameState?.players.map(({ id, team }) => [id, team]));
  const hostViewer = players.some((player) => player.id === viewerId && player.isHost);
  return {
    phase,
    players: players.map(({ id, name, isHost, connected }) => {
      const team = teams.get(id);
      return { id, name, isHost, connected, ...(team && (hostViewer || id === viewerId) ? { team } : {}) };
    }),
  };
}
