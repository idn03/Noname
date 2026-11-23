import { applyGameCommand } from '../game-engine/game-engine';
import { initializeCardSelection } from '../game-engine/initialize-card-selection';
import { createGameState, type GamePlayer, type GameState } from '../game-engine/game-types';
import { prepareBalancedTeams } from '../game-engine/team-assignment';

export const selectionRandom = { nextInt: () => 0 };
export const selectionPlayers: GamePlayer[] = [
  { id: 'host', name: 'Host', isHost: true },
  ...Array.from({ length: 7 }, (_, index) => ({ id: `p${index}`, name: `P${index}`, isHost: false })),
];
export const selectionPools = ['music', 'travel', 'geography', 'films', 'healthcare', 'folklore'].map((categoryId) => ({
  categoryId,
  categoryName: categoryId,
  challenges: [1, 2, 3].map((index) => ({ id: `${categoryId}-${index}`, text: `Text ${categoryId}-${index}` })),
}));

export function createSelectionState(): GameState {
  const started = applyGameCommand(createGameState(selectionPlayers), { type: 'start', actorId: 'host' }, {
    random: selectionRandom, prepareTeams: prepareBalancedTeams, now: () => 1_000,
  });
  if (!started.ok) throw new Error(started.error.message);
  const configured = initializeCardSelection(started.value, selectionPools, selectionRandom);
  if (!configured.ok) throw new Error(configured.error.message);
  return configured.value;
}

export function submitSelection(state: GameState, playerId: string, challenge = true, category?: string, challengeIndex = 0) {
  const player = state.players.find(({ id }) => id === playerId);
  if (!player?.team) throw new Error('Expected an assigned player');
  const categoryId = category ?? state.cardSelection?.categoryIdsByTeam[player.team][0];
  if (!categoryId) throw new Error('Expected an allowed category');
  const challengeId = state.cardSelection?.challengeIdsByCategory[categoryId][challengeIndex];
  return applyGameCommand(state, {
    type: 'select-card', actorId: playerId, categoryId,
    ...(player.team === 'wolf' && challenge ? { challengeId } : {}),
  }, { random: selectionRandom, prepareTeams: prepareBalancedTeams });
}
