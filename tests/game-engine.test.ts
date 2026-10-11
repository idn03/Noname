import { describe, expect, it } from 'vitest';
import { applyGameCommand, type TeamPreparation } from '../web-game/game/game-engine';
import { gameError } from '../web-game/game/game-error';
import { createGameState, type GamePlayer, type GameState } from '../web-game/game/game-types';
import { shuffled, type RandomSource } from '../web-game/game/randomness';

const players: GamePlayer[] = [
  { id: 'host', name: 'Host', isHost: true },
  { id: 'guest', name: 'Guest', isHost: false },
];
const random: RandomSource = { nextInt: () => 0 };
const prepareTeams: TeamPreparation = (input) => ({
  ok: true,
  value: { players: input.map((player, index) => ({ ...player, team: index ? 'sheep' : 'wolf' })), rounds: 1 },
});
const start = (state: GameState, actorId = 'host', prepare = prepareTeams) =>
  applyGameCommand(state, { type: 'start', actorId }, { random, prepareTeams: prepare });

describe('game engine foundation', () => {
  it('creates default lobby state without mutating the supplied player list', () => {
    const players = [
      { id: 'host', name: 'Host', isHost: true, team: 'wolf' as const },
      { id: 'guest', name: 'Guest', isHost: false },
    ];
    const original = structuredClone(players);
    const state = createGameState(players);

    expect(state).toEqual({
      phase: 'lobby',
      players: [
        { id: 'host', name: 'Host', isHost: true },
        { id: 'guest', name: 'Guest', isHost: false },
      ],
      round: 0,
      rounds: 0,
      scores: { wolf: 0, sheep: 0 },
    });
    expect(players).toEqual(original);
    expect(state.players).not.toBe(players);
  });

  it('shuffles deterministically with injected randomness and preserves its input', () => {
    const items = ['a', 'b', 'c', 'd'];
    const bounds: number[] = [];
    const random: RandomSource = { nextInt: (upperBound) => { bounds.push(upperBound); return 0; } };

    expect(shuffled(items, random)).toEqual(['b', 'c', 'd', 'a']);
    expect(bounds).toEqual([4, 3, 2]);
    expect(items).toEqual(['a', 'b', 'c', 'd']);
  });

  it('returns a stable serializable domain error result', () => {
    const result = gameError<never>('INVALID_PHASE', 'Action is unavailable in this phase.');

    expect(result).toEqual({
      ok: false,
      error: { code: 'INVALID_PHASE', message: 'Action is unavailable in this phase.' },
    });
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });

  it('starts through injected team preparation without assigning teams itself', () => {
    const initial = createGameState(players);
    const result = start(initial);

    expect(result).toMatchObject({ ok: true, value: { phase: 'selection', rounds: 1 } });
    if (result.ok) expect(result.value.players.map((player) => player.team)).toEqual(['wolf', 'sheep']);
    expect(initial.phase).toBe('lobby');
    expect(initial.players.every((player) => player.team === undefined)).toBe(true);
  });

  it('rejects unauthorized and wrong-phase starts without changing input state', () => {
    const initial = createGameState(players);
    const original = structuredClone(initial);
    expect(start(initial, 'guest')).toMatchObject({ ok: false, error: { code: 'NOT_AUTHORIZED' } });
    expect(initial).toEqual(original);

    const nonLobby = { ...initial, phase: 'turns' as const };
    const nonLobbyOriginal = structuredClone(nonLobby);
    expect(start(nonLobby)).toMatchObject({ ok: false, error: { code: 'INVALID_PHASE' } });
    expect(nonLobby).toEqual(nonLobbyOriginal);
  });

  it('leaves input unchanged when preparation fails or returns an invalid assignment', () => {
    const initial = createGameState(players);
    const original = structuredClone(initial);
    const failedPreparation: TeamPreparation = () => gameError('INVALID_INPUT', 'Preparation failed.');
    expect(start(initial, 'host', failedPreparation)).toMatchObject({
      ok: false, error: { code: 'INVALID_INPUT', message: 'Preparation failed.' },
    });
    expect(initial).toEqual(original);

    const invalidPreparation: TeamPreparation = (input) => ({
      ok: true,
      value: {
        players: input.map((player) => ({ ...player, id: 'duplicate', team: 'wolf' })),
        rounds: 1,
      },
    });
    expect(start(initial, 'host', invalidPreparation)).toMatchObject({
      ok: false, error: { code: 'INVALID_ASSIGNMENT' },
    });
    expect(initial).toEqual(original);
  });
});
