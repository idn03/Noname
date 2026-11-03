import { describe, expect, it } from 'vitest';
import { applyGameCommand } from '../web-game/game/game-engine';
import type { GameState } from '../web-game/game/game-types';
import { prepareBalancedTeams } from '../web-game/game/team-assignment';
import { createSelectionState, selectionRandom, submitSelection } from './card-selection-fixture';

describe('card selection logic', () => {
  it('assigns equal slot counts to uneven teams and sets time from actual slots', () => {
    const state = createSelectionState();
    const teamPlayers = state.players.filter((player) => !player.isHost);
    expect(teamPlayers.filter((player) => player.team === 'wolf')).toHaveLength(4);
    expect(teamPlayers.filter((player) => player.team === 'sheep')).toHaveLength(3);
    expect(teamPlayers.filter((player) => player.hasCardSlot)).toHaveLength(6);
    expect(teamPlayers.filter((player) => player.hasCardSlot === false).map((player) => player.team)).toEqual(['wolf']);
    expect(state.selectionDeadlineMs).toBe(1_000 + 3 * 60_000);
    expect(state.cardSelection?.categoryIdsByTeam.wolf).toHaveLength(4);
    expect(state.cardSelection?.categoryIdsByTeam.sheep).toHaveLength(4);
  });

  it('rejects slotless, Host, wrong-category, and invalid challenge submissions atomically', () => {
    const state = createSelectionState();
    const slotless = state.players.find((player) => player.hasCardSlot === false);
    const wolf = state.players.find((player) => player.team === 'wolf' && player.hasCardSlot);
    if (!slotless || !wolf) throw new Error('Expected a slotless player and Wolf slot');
    const rejected = submitSelection(state, slotless.id);
    expect(rejected).toMatchObject({ ok: false, error: { code: 'NOT_AUTHORIZED' } });
    const wolfCategory = state.cardSelection?.categoryIdsByTeam.wolf[0];
    expect(applyGameCommand(state, {
      type: 'select-card', actorId: 'host', categoryId: wolfCategory ?? '', challengeId: 'music-1',
    }, { random: selectionRandom, prepareTeams: prepareBalancedTeams })).toMatchObject({
      ok: false, error: { code: 'NOT_AUTHORIZED' },
    });
    expect(submitSelection(state, wolf.id, false)).toMatchObject({ ok: false, error: { code: 'INVALID_INPUT' } });
    expect(applyGameCommand(state, {
      type: 'select-card', actorId: wolf.id, categoryId: wolfCategory ?? '', challengeId: 'unknown-challenge',
    }, { random: selectionRandom, prepareTeams: prepareBalancedTeams })).toMatchObject({
      ok: false, error: { code: 'INVALID_INPUT' },
    });
    expect(applyGameCommand(state, { type: 'select-card', actorId: wolf.id, categoryId: 'missing', challengeId: 'bad' }, {
      random: selectionRandom, prepareTeams: prepareBalancedTeams,
    })).toMatchObject({ ok: false, error: { code: 'INVALID_INPUT' } });
    expect(state.players.every((player) => !player.cardCategory)).toBe(true);
  });

  it('keeps selection open after expiry and advances only when every slot is submitted', () => {
    let state: GameState = { ...createSelectionState(), selectionDeadlineMs: 1 };
    const slots = state.players.filter((player) => !player.isHost && player.hasCardSlot);
    const categories = state.cardSelection?.categoryIdsByTeam;
    for (const [index, player] of slots.entries()) {
      const categoryId = player.team && categories?.[player.team][0];
      const result = submitSelection(state, player.id, true, categoryId);
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      state = result.value;
      expect(state.phase).toBe(index === slots.length - 1 ? 'turns' : 'selection');
    }
    expect(state.players.filter((player) => player.hasCardSlot && player.cardCategory)).toHaveLength(6);
    expect(submitSelection(state, slots[0].id)).toMatchObject({ ok: false, error: { code: 'INVALID_PHASE' } });
  });

  it('removes a submitted selection to unready the slot until it is resubmitted', () => {
    const state = createSelectionState();
    const player = state.players.find((candidate) => candidate.hasCardSlot);
    if (!player) throw new Error('Expected a card slot');
    const selected = submitSelection(state, player.id);
    if (!selected.ok) throw new Error(selected.error.message);
    if (!player.team) throw new Error('Expected team assignment');
    const alternativeCategory = selected.value.cardSelection?.categoryIdsByTeam[player.team][1];
    if (!alternativeCategory) throw new Error('Expected an alternative category');
    const revised = submitSelection(selected.value, player.id, true, alternativeCategory);
    if (!revised.ok) throw new Error(revised.error.message);
    expect(revised.value.players.find(({ id }) => id === player.id)?.cardCategory).toBe(alternativeCategory);
    const removed = applyGameCommand(revised.value, { type: 'remove-card', actorId: player.id }, {
      random: selectionRandom, prepareTeams: prepareBalancedTeams,
    });
    expect(removed).toMatchObject({ ok: true, value: { phase: 'selection' } });
    if (removed.ok) {
      const unselected = removed.value.players.find(({ id }) => id === player.id);
      expect(unselected?.cardCategory).toBeUndefined();
      expect(unselected?.cardChallengeId).toBeUndefined();
      expect(unselected?.cardSubmitted).toBe(false);
    }
  });

});
