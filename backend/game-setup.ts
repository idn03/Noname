import { applyGameCommand } from '../web-game/game/game-engine';
import { createGameState, type GamePlayer, type GameState } from '../web-game/game/game-types';
import { prepareBalancedTeams } from '../web-game/game/team-assignment';
import type { RandomSource } from '../web-game/game/randomness';
import { initializeCardSelection } from '../web-game/game/initialize-card-selection';
import { prepareSessionPools, type SessionCategoryPool } from './db/session-pool';
import type { CategoryContent } from './db/content-validation';

export interface GameSetup {
  gameState: GameState;
  pools: readonly SessionCategoryPool[];
}

export function prepareGameSetup(
  players: readonly GamePlayer[],
  actorId: string,
  categories: readonly CategoryContent[],
  random: RandomSource,
  sandbox = false,
  now: () => number = Date.now,
): GameSetup | undefined {
  try {
    const pools = prepareSessionPools(categories, random);
    const initial = createGameState(players.map(({ id, name, isHost }) => ({ id, name, isHost })));
    const started = applyGameCommand(initial, { type: 'start', actorId }, {
      random,
      prepareTeams: prepareBalancedTeams,
      now,
    });
    if (!started.ok) return undefined;
    const withSelection = initializeCardSelection(started.value, pools, random, sandbox);
    if (!withSelection.ok) return undefined;
    const gameState = sandbox ? applySandboxDefaults(withSelection.value, random) : withSelection.value;
    if (!gameState) return undefined;
    return {
      gameState: { ...gameState, players: gameState.players.filter((player) => !player.isHost) },
      pools,
    };
  } catch (error) {
    console.error('Game setup preparation failed', error);
    return undefined;
  }
}

function applySandboxDefaults(state: GameState, random: RandomSource): GameState | undefined {
  const challengeIds = state.cardSelection?.challengeIdsByCategory.music ?? [];
  if (!challengeIds.length) return undefined;
  let current = state;
  const sheepPattern = ['music', 'music', 'travel'] as const;
  const sheep = current.players.filter((player) => !player.isHost && player.team === 'sheep' && player.hasCardSlot);
  const wolf = current.players.filter((player) => !player.isHost && player.team === 'wolf' && player.hasCardSlot);

  for (const player of wolf) {
    const result = applyGameCommand(current, {
      type: 'select-card', actorId: player.id, categoryId: 'music',
      challengeId: challengeIds[random.nextInt(challengeIds.length)],
    }, { random, prepareTeams: prepareBalancedTeams });
    if (!result.ok) return undefined;
    current = result.value;
  }
  for (const [index, player] of sheep.entries()) {
    const result = applyGameCommand(current, {
      type: 'select-card', actorId: player.id, categoryId: sheepPattern[index % sheepPattern.length],
    }, { random, prepareTeams: prepareBalancedTeams });
    if (!result.ok) return undefined;
    current = result.value;
  }
  return current;
}
