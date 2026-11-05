import type { ActiveTurnView, OwnTurnCardView, RevealedGameCardView } from '../shared/card-selection-contract';
import type { GameState } from '../web-game/game/game-types';
import type { SessionCategoryPool } from './db/session-pool';

export function revealedCards(state: GameState, pools: readonly SessionCategoryPool[]): RevealedGameCardView[] {
  return state.players.flatMap((player) => {
    if (player.isHost || !player.team || !player.cardSubmitted || !player.cardCategory) return [];
    const category = pools.find((pool) => pool.categoryId === player.cardCategory);
    if (!category) return [];
    const challenge = player.team === 'wolf' ? category.challenges.find(({ id }) => id === player.cardChallengeId) : undefined;
    return [{
      playerId: player.id, team: player.team, categoryId: category.categoryId, categoryName: category.categoryName,
      challengeCount: category.challenges.length, ...(challenge ? { challenge: { id: challenge.id, text: challenge.text } } : {}),
      used: player.cardUsed === true,
    }];
  });
}

export function activeTurnView(state: GameState, pools: readonly SessionCategoryPool[]): ActiveTurnView | undefined {
  const active = state.activeTurn;
  if (!active) return undefined;
  const category = pools.find(({ categoryId }) => categoryId === active.attackCategoryId);
  const challenge = category?.challenges.find(({ id }) => id === active.attackChallengeId);
  if (!category || !challenge) return undefined;
  return {
    round: active.round,
    attackerId: active.attackerId, attackCategoryId: active.attackCategoryId,
    attackCategoryName: category.categoryName, challenge: { id: challenge.id, text: challenge.text },
    ...(active.defenderId ? { defenderId: active.defenderId } : {}),
    ...(active.defenseCategoryId ? { defenseCategoryId: active.defenseCategoryId } : {}),
  };
}

export function ownTurnCard(state: GameState, pools: readonly SessionCategoryPool[], playerId: string): OwnTurnCardView | undefined {
  const player = state.players.find(({ id }) => id === playerId);
  if (!player || player.isHost || !player.team || !player.cardCategory) return undefined;
  const category = pools.find(({ categoryId }) => categoryId === player.cardCategory);
  if (!category) return undefined;
  const challenge = player.team === 'wolf' ? category.challenges.find(({ id }) => id === player.cardChallengeId) : undefined;
  const active = state.activeTurn;
  return {
    categoryId: category.categoryId, categoryName: category.categoryName,
    ...(challenge ? { challenge: { id: challenge.id, text: challenge.text } } : {}),
    used: player.cardUsed === true,
    canAttack: player.team === 'wolf' && player.hasCardSlot === true && player.cardSubmitted === true
      && player.cardUsed !== true && !active && state.round <= state.rounds,
    canDefend: player.team === 'sheep' && player.hasCardSlot === true && player.cardSubmitted === true
      && player.cardUsed !== true && Boolean(active && !active.defenderId && active.attackCategoryId === player.cardCategory),
  };
}
