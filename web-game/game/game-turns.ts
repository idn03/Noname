import { gameError, type GameResult } from './game-error';
import type { CompletedRound, GameCommand, GamePlayer, GameState, Team } from './game-types';
import type { RandomSource } from './randomness';

type TurnCommand = Extract<GameCommand, { type: 'attack' | 'defend' | 'record-challenge-outcome' }>;

export function applyTurnCommand(state: GameState, command: TurnCommand, random: RandomSource): GameResult<GameState> {
  if (state.phase !== 'turns') return gameError('INVALID_PHASE', 'Turn actions are only available during gameplay.');
  if (command.type === 'attack') return attack(state, command.actorId, command.round, random);
  if (command.type === 'defend') return defend(state, command.actorId, command.round);
  return recordOutcome(state, command.actorId, command.round, command.succeeded);
}

function attack(state: GameState, actorId: string, round: number, random: RandomSource): GameResult<GameState> {
  if (round !== state.round) return gameError('INVALID_INPUT', 'The attack belongs to a different round.');
  if (state.activeTurn) return gameError('INVALID_PHASE', 'Resolve the active attack before starting another.');
  if (state.round < 1 || state.round > state.rounds) return gameError('INVALID_PHASE', 'No rounds remain.');
  const wolf = state.players.find(({ id }) => id === actorId);
  if (!wolf || wolf.isHost || wolf.team !== 'wolf' || wolf.hasCardSlot !== true
    || !isReady(wolf) || wolf.cardUsed === true) {
    return gameError('NOT_AUTHORIZED', 'Only a Wolf player with an unused card can attack.');
  }
  if (!state.cardSelection) return gameError('INVALID_COMMAND', 'The game card pool is unavailable.');
  const categoryId = wolf.cardCategory as string;
  const availableChallenges = state.cardSelection.challengeIdsByCategory[categoryId] ?? [];
  if (!wolf.cardChallengeId || !availableChallenges.includes(wolf.cardChallengeId)) {
    return gameError('INVALID_INPUT', 'The selected Wolf challenge is unavailable.');
  }
  const challengeId = chooseChallenge(state, wolf, categoryId, random);
  if (!challengeId) return gameError('INVALID_INPUT', 'No challenge is available for this attack category.');

  const activeTurn = { round, attackerId: actorId, attackCategoryId: categoryId, attackChallengeId: challengeId };
  const players = replacePlayer(state.players, actorId, { cardUsed: true });
  const started = { ...state, players, activeTurn, usedChallengeIds: [...(state.usedChallengeIds ?? []), challengeId] };
  const canDefend = players.some((player) => player.team === 'sheep' && isReady(player)
    && player.cardUsed !== true && player.cardCategory === categoryId);
  return canDefend ? { ok: true, value: started } : completeRound(started, undefined);
}

function defend(state: GameState, actorId: string, round: number): GameResult<GameState> {
  const active = state.activeTurn;
  if (round !== state.round || active?.round !== round) return gameError('INVALID_INPUT', 'The defense belongs to a different round.');
  if (!active || active.defenderId) return gameError('INVALID_PHASE', 'There is no attack waiting for a defense.');
  const sheep = state.players.find(({ id }) => id === actorId);
  if (!sheep || sheep.isHost || sheep.team !== 'sheep' || sheep.hasCardSlot !== true || !isReady(sheep)
    || sheep.cardUsed === true || sheep.cardCategory !== active.attackCategoryId) {
    return gameError('NOT_AUTHORIZED', 'Use an unused matching card from your Sheep slot to defend.');
  }
  if (!state.cardSelection?.challengeIdsByCategory[active.attackCategoryId]?.includes(active.attackChallengeId)) {
    return gameError('INVALID_INPUT', 'The active challenge is not in the session pool.');
  }
  const activeTurn = { ...active, defenderId: actorId, defenseCategoryId: sheep.cardCategory };
  return { ok: true, value: { ...state, activeTurn, players: replacePlayer(state.players, actorId, { cardUsed: true }) } };
}

function recordOutcome(state: GameState, actorId: string, round: number, succeeded: boolean): GameResult<GameState> {
  const host = state.players.find(({ id }) => id === actorId);
  if (state.hostId !== actorId && !host?.isHost) return gameError('NOT_AUTHORIZED', 'Only the Host can record a challenge outcome.');
  if (typeof succeeded !== 'boolean') return gameError('INVALID_INPUT', 'Choose a valid challenge outcome.');
  if (!state.activeTurn?.defenderId || state.activeTurn.round !== round || state.round !== round) {
    return gameError('INVALID_PHASE', 'No defended challenge is awaiting an outcome in this round.');
  }
  return completeRound(state, succeeded);
}

function completeRound(state: GameState, succeeded: boolean | undefined): GameResult<GameState> {
  const active = state.activeTurn;
  if (!active) return gameError('INVALID_COMMAND', 'The active turn is missing.');
  const scoreChange: Record<Team, number> = active.defenderId
    ? { wolf: 0, sheep: succeeded ? 2 : 1 }
    : { wolf: 2, sheep: 0 };
  const entry: CompletedRound = { ...active, challengeSucceeded: succeeded, scoreChange };
  const round = state.round + 1;
  return { ok: true, value: {
    ...state,
    players: state.players,
    scores: { wolf: state.scores.wolf + scoreChange.wolf, sheep: state.scores.sheep + scoreChange.sheep },
    activeTurn: undefined,
    roundHistory: [...(state.roundHistory ?? []), entry],
    round,
    ...(round > state.rounds ? { phase: 'results' as const, winner: winner(state.scores.wolf + scoreChange.wolf, state.scores.sheep + scoreChange.sheep) } : {}),
  } };
}

function chooseChallenge(state: GameState, wolf: GamePlayer, categoryId: string, random: RandomSource): string | undefined {
  const choices = state.cardSelection?.challengeIdsByCategory[categoryId] ?? [];
  const cardChoice = wolf.cardChallengeId;
  const used = state.usedChallengeIds ?? [];
  if (cardChoice && choices.includes(cardChoice) && !used.includes(cardChoice)) return cardChoice;
  const unused = choices.filter((id) => !used.includes(id));
  const candidates = unused.length ? unused : choices;
  return candidates.length ? candidates[random.nextInt(candidates.length)] : undefined;
}

function isReady(player: GamePlayer): boolean { return player.cardSubmitted === true && Boolean(player.cardCategory); }
function replacePlayer(players: readonly GamePlayer[], id: string, patch: Partial<GamePlayer>): GamePlayer[] {
  return players.map((player) => player.id === id ? { ...player, ...patch } : player);
}
function winner(wolf: number, sheep: number): Team | 'draw' { return wolf === sheep ? 'draw' : wolf > sheep ? 'wolf' : 'sheep'; }
