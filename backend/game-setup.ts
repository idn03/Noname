import { applyGameCommand } from '../web-game/game/game-engine';
import { createGameState, type GamePlayer, type GameState } from '../web-game/game/game-types';
import { prepareBalancedTeams } from '../web-game/game/team-assignment';
import type { RandomSource } from '../web-game/game/randomness';
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
): GameSetup | undefined {
  try {
    const pools = prepareSessionPools(categories, random);
    const initial = createGameState(players.map(({ id, name, isHost }) => ({ id, name, isHost })));
    const started = applyGameCommand(initial, { type: 'start', actorId }, {
      random,
      prepareTeams: prepareBalancedTeams,
    });
    if (!started.ok) return undefined;
    return {
      gameState: { ...started.value, players: started.value.players.filter((player) => !player.isHost) },
      pools,
    };
  } catch (error) {
    console.error('Game setup preparation failed', error);
    return undefined;
  }
}
