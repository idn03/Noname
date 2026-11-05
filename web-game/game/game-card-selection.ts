import { gameError, type GameResult } from './game-error';
import type { GameCommand, GamePlayer, GameState, Team } from './game-types';

type CardSelectionCommand = Extract<GameCommand, { type: 'select-card' | 'remove-card' }>;

export function applyCardSelectionCommand(
  state: GameState,
  command: CardSelectionCommand,
): GameResult<GameState> {
  if (state.phase !== 'selection') return gameError('INVALID_PHASE', 'Cards can only be changed during selection.');
  const player = state.players.find(({ id }) => id === command.actorId);
  if (!player || player.isHost || !player.team || player.hasCardSlot !== true) {
    return gameError('NOT_AUTHORIZED', 'Only a player with a card slot can manage a card.');
  }
  if (!state.cardSelection) return gameError('INVALID_COMMAND', 'Card selection is not initialized.');

  const updated = command.type === 'select-card'
    ? selectCard(state, player, command.categoryId, command.challengeId)
    : removeCard(state, player);
  if (updated.ok === false) return updated;

  const complete = updated.value.players
    .filter((candidate) => !candidate.isHost && candidate.hasCardSlot === true)
    .every(isCompleteSelection);
  return { ok: true, value: complete ? { ...updated.value, phase: 'turns', round: 1 } : updated.value };
}

function selectCard(
  state: GameState,
  player: GamePlayer,
  categoryId: string,
  challengeId?: string,
): GameResult<GameState> {
  if (typeof categoryId !== 'string' || !categoryId.trim()) return gameError('INVALID_INPUT', 'Choose a valid category.');
  const team = player.team as Team;
  const allowedCategories = state.cardSelection?.categoryIdsByTeam[team] ?? [];
  if (!allowedCategories.includes(categoryId)) return gameError('INVALID_INPUT', 'This category is not available to your team.');

  const challengeIds = state.cardSelection?.challengeIdsByCategory[categoryId] ?? [];
  if (team === 'wolf' && (!challengeId || !challengeIds.includes(challengeId))) {
    return gameError('INVALID_INPUT', 'Choose a challenge from this category.');
  }
  if (team === 'sheep' && challengeId !== undefined) {
    return gameError('INVALID_INPUT', 'Sheep selections cannot include challenge details.');
  }
  if (team === 'wolf' && state.players.some((candidate) => candidate.team === 'wolf'
    && candidate.id !== player.id && candidate.cardSubmitted === true
    && candidate.cardCategory === categoryId && candidate.cardChallengeId === challengeId)) {
    return gameError('INVALID_INPUT', 'This challenge is already selected by a Wolf teammate.');
  }

  return replacePlayer(state, player.id, {
    cardCategory: categoryId,
    ...(team === 'wolf' ? { cardChallengeId: challengeId } : {}),
    cardSubmitted: true,
  });
}

function removeCard(state: GameState, player: GamePlayer): GameResult<GameState> {
  if (!player.cardCategory || player.cardSubmitted !== true) return gameError('NOT_FOUND', 'No submitted card is available to remove.');
  const { cardCategory: _category, cardChallengeId: _challenge, ...unselected } = player;
  const players = state.players.map((current) => current.id === player.id
    ? { ...unselected, cardSubmitted: false }
    : current);
  return { ok: true, value: { ...state, players } };
}

function replacePlayer(state: GameState, playerId: string, changes: Partial<GamePlayer>): GameResult<GameState> {
  const players = state.players.map((player) => player.id === playerId ? { ...player, ...changes } : player);
  return { ok: true, value: { ...state, players } };
}

function isCompleteSelection(player: GamePlayer): boolean {
  return player.cardSubmitted === true && Boolean(player.cardCategory)
    && (player.team !== 'wolf' || Boolean(player.cardChallengeId));
}
