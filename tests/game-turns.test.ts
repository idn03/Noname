import { describe, expect, it } from 'vitest';
import { applyGameCommand } from '../web-game/game/game-engine';
import type { GameCommand, GamePlayer, GameState } from '../web-game/game/game-types';
import { prepareBalancedTeams } from '../web-game/game/team-assignment';

const random = { nextInt: () => 0 };
const players: GamePlayer[] = [
  { id: 'wolf-1', name: 'Wolf 1', isHost: false, team: 'wolf', hasCardSlot: true, cardCategory: 'music', cardChallengeId: 'm1', cardSubmitted: true },
  { id: 'wolf-2', name: 'Wolf 2', isHost: false, team: 'wolf', hasCardSlot: true, cardCategory: 'music', cardChallengeId: 'm2', cardSubmitted: true },
  { id: 'sheep-1', name: 'Sheep 1', isHost: false, team: 'sheep', hasCardSlot: true, cardCategory: 'music', cardSubmitted: true },
  { id: 'sheep-2', name: 'Sheep 2', isHost: false, team: 'sheep', hasCardSlot: true, cardCategory: 'music', cardSubmitted: true },
  { id: 'sheep-3', name: 'Sheep 3', isHost: false, team: 'sheep', hasCardSlot: false, cardCategory: 'travel', cardSubmitted: true },
];
const state = (playersOverride = players): GameState => ({
  phase: 'turns', hostId: 'host', players: structuredClone(playersOverride), round: 1, rounds: 2,
  scores: { wolf: 0, sheep: 0 }, usedChallengeIds: [], roundHistory: [],
  cardSelection: { categoryIdsByTeam: { wolf: ['music'], sheep: ['music', 'travel'] }, challengeIdsByCategory: { music: ['m1', 'm2'], travel: ['t1'] } },
});
const command = (game: GameState, value: GameCommand) => applyGameCommand(game, value, { random, prepareTeams: prepareBalancedTeams });

describe('turn gameplay engine', () => {
  it('allows an unused Wolf owner to attack once and rejects unauthorized, stale, and concurrent attacks', () => {
    const initial = state();
    const before = structuredClone(initial);
    expect(command(initial, { type: 'attack', actorId: 'sheep-1', round: 1 })).toMatchObject({ ok: false });
    expect(command(initial, { type: 'attack', actorId: 'wolf-1', round: 2 })).toMatchObject({ ok: false });
    expect(initial).toEqual(before);
    const attack = command(initial, { type: 'attack', actorId: 'wolf-1', round: 1 });
    expect(attack).toMatchObject({ ok: true, value: { activeTurn: { attackerId: 'wolf-1', attackChallengeId: 'm1' } } });
    if (!attack.ok) return;
    expect(attack.value.players.find(({ id }) => id === 'wolf-1')?.cardUsed).toBe(true);
    expect(command(attack.value, { type: 'attack', actorId: 'wolf-2', round: 1 })).toMatchObject({ ok: false });
  });

  it('rejects turn commands outside gameplay without changing the supplied state', () => {
    const selectionState = { ...state(), phase: 'selection' as const };
    const before = structuredClone(selectionState);
    expect(command(selectionState, { type: 'attack', actorId: 'wolf-1', round: 1 })).toMatchObject({ ok: false, error: { code: 'INVALID_PHASE' } });
    expect(command(selectionState, { type: 'defend', actorId: 'sheep-1', round: 1 })).toMatchObject({ ok: false, error: { code: 'INVALID_PHASE' } });
    expect(command(selectionState, { type: 'record-challenge-outcome', actorId: 'host', round: 1, succeeded: true })).toMatchObject({ ok: false, error: { code: 'INVALID_PHASE' } });
    expect(selectionState).toEqual(before);
  });

  it('accepts the first matching Sheep defense and rejects mismatches, duplicates, and stale rounds', () => {
    const attack = command(state(), { type: 'attack', actorId: 'wolf-1', round: 1 });
    if (!attack.ok) throw new Error('Expected attack');
    const before = structuredClone(attack.value);
    expect(command(attack.value, { type: 'defend', actorId: 'sheep-3', round: 1 })).toMatchObject({ ok: false });
    expect(command(attack.value, { type: 'defend', actorId: 'sheep-1', round: 2 })).toMatchObject({ ok: false });
    expect(attack.value).toEqual(before);
    const defense = command(attack.value, { type: 'defend', actorId: 'sheep-1', round: 1 });
    expect(defense).toMatchObject({ ok: true, value: { activeTurn: { defenderId: 'sheep-1', defenseCategoryId: 'music' } } });
    if (!defense.ok) return;
    expect(defense.value.players.find(({ id }) => id === 'sheep-1')?.cardUsed).toBe(true);
    expect(command(defense.value, { type: 'defend', actorId: 'sheep-2', round: 1 })).toMatchObject({ ok: false });
  });

  it('records one Host outcome, scores it, advances rounds, and finishes at the round limit', () => {
    let game = state();
    for (const wolfId of ['wolf-1', 'wolf-2']) {
      const round = game.round;
      const attack = command(game, { type: 'attack', actorId: wolfId, round });
      if (!attack.ok) throw new Error('Expected attack');
      const sheepId = round === 1 ? 'sheep-1' : 'sheep-2';
      const defense = command(attack.value, { type: 'defend', actorId: sheepId, round });
      if (!defense.ok) throw new Error('Expected defense');
      const unauthorized = command(defense.value, { type: 'record-challenge-outcome', actorId: sheepId, round, succeeded: true });
      expect(unauthorized).toMatchObject({ ok: false, error: { code: 'NOT_AUTHORIZED' } });
      const result = command(defense.value, { type: 'record-challenge-outcome', actorId: 'host', round, succeeded: true });
      if (!result.ok) throw new Error('Expected Host outcome');
      game = result.value;
      expect(game.scores.sheep).toBe(round * 2);
      expect(game.round).toBe(round + 1);
      if (round === 1) {
        expect(command(game, { type: 'attack', actorId: 'wolf-1', round: 2 })).toMatchObject({ ok: false });
        expect(command(game, { type: 'record-challenge-outcome', actorId: 'host', round, succeeded: true })).toMatchObject({ ok: false });
      }
    }
    expect(game).toMatchObject({ phase: 'results', winner: 'sheep', roundHistory: [{ challengeSucceeded: true }, { challengeSucceeded: true }] });
    expect(command(game, { type: 'attack', actorId: 'wolf-1', round: 3 })).toMatchObject({ ok: false });
  });

  it('resolves an undefended attack for Wolf and chooses an unused challenge in the next round', () => {
    const noMatch = state(players.map((player) => player.team === 'sheep' ? { ...player, cardCategory: 'travel' } : player));
    const undefended = command(noMatch, { type: 'attack', actorId: 'wolf-1', round: 1 });
    expect(undefended).toMatchObject({ ok: true, value: { scores: { wolf: 2, sheep: 0 }, round: 2 } });
    const nextRound = state();
    const variety = { ...nextRound, round: 2, usedChallengeIds: ['m1'], players: nextRound.players.map((player) =>
      player.id === 'wolf-1' ? { ...player, cardUsed: true } : player) };
    const next = command(variety, { type: 'attack', actorId: 'wolf-2', round: 2 });
    expect(next).toMatchObject({ ok: true, value: { activeTurn: { attackChallengeId: 'm2' } } });
  });
});
