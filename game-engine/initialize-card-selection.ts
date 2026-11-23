import { gameError, type GameResult } from './game-error';
import type { GameState, Team } from './game-types';
import { shuffled, type RandomSource } from './randomness';

export interface SelectionChallengePool {
  categoryId: string;
  challenges: readonly { id: string }[];
}

export function initializeCardSelection(
  state: GameState,
  pools: readonly SelectionChallengePool[],
  random: RandomSource,
  sandbox = false,
): GameResult<GameState> {
  if (state.phase !== 'selection') return gameError('INVALID_PHASE', 'Card selection requires the Selection Phase.');
  if (!pools.length || pools.some(({ categoryId, challenges }) => !categoryId || !challenges.length
    || challenges.some(({ id }) => !id) || new Set(challenges.map(({ id }) => id)).size !== challenges.length)) {
    return gameError('INVALID_INPUT', 'Each available category must have a challenge pool.');
  }
  const categoryIds = pools.map(({ categoryId }) => categoryId);
  if (new Set(categoryIds).size !== categoryIds.length) return gameError('INVALID_INPUT', 'Category identifiers must be unique.');

  const categoryIdsByTeam = {} as Record<Team, readonly string[]>;
  for (const team of ['wolf', 'sheep'] as const) {
    const slots = state.players.filter((player) => !player.isHost && player.team === team && player.hasCardSlot === true).length;
    const required = sandbox ? requiredSandboxCategories(team) : [];
    const available = categoryIds.filter((categoryId) => !required.includes(categoryId));
    const count = slots + 1;
    if (required.length > count || count > categoryIds.length || required.some((id) => !categoryIds.includes(id))) {
      return gameError('INVALID_INPUT', 'There are not enough categories for team selection.');
    }
    categoryIdsByTeam[team] = [...required, ...shuffled(available, random).slice(0, count - required.length)];
  }

  return {
    ok: true,
    value: {
      ...state,
      cardSelection: {
        categoryIdsByTeam,
        challengeIdsByCategory: Object.fromEntries(pools.map((pool) => [pool.categoryId, pool.challenges.map(({ id }) => id)])),
      },
    },
  };
}

function requiredSandboxCategories(team: Team): readonly string[] {
  return team === 'wolf' ? ['music'] : ['music', 'travel'];
}
