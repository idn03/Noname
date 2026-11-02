import { describe, expect, it } from 'vitest';
import { createHostCardSelectionView, createPlayerCardSelectionView } from '../backend/card-selection-view';
import { submitSelection, createSelectionState, selectionPools } from './card-selection-fixture';

describe('role-filtered card selection views', () => {
  it('shows challenge text only to Wolves and keeps the slotless player read-only', () => {
    const state = createSelectionState();
    const wolf = state.players.find((player) => player.team === 'wolf' && player.hasCardSlot);
    const sheep = state.players.find((player) => player.team === 'sheep' && player.hasCardSlot);
    const slotless = state.players.find((player) => player.hasCardSlot === false);
    if (!wolf || !sheep || !slotless) throw new Error('Expected Wolf, Sheep, and slotless members');

    const wolfView = createPlayerCardSelectionView(state, selectionPools, wolf.id, 1_000);
    const sheepView = createPlayerCardSelectionView(state, selectionPools, sheep.id, 1_000);
    const slotlessView = createPlayerCardSelectionView(state, selectionPools, slotless.id, 1_000);
    expect(wolfView.ok && wolfView.value.categories[0].challenges?.length).toBeGreaterThan(0);
    expect(sheepView.ok && sheepView.value.categories.every((category) => category.challenges === undefined)).toBe(true);
    expect(sheepView).toMatchObject({ ok: true, value: { remainingMs: 360_000 } });
    expect(slotlessView).toMatchObject({ ok: true, value: { hasCardSlot: false, categories: [] } });
    if (sheepView.ok) expect(JSON.stringify(sheepView.value)).not.toMatch(/Text|music-1/);
  });

  it('gives the Host roster readiness without selections or challenge text', () => {
    const state = createSelectionState();
    const wolf = state.players.find((player) => player.team === 'wolf' && player.hasCardSlot);
    if (!wolf) throw new Error('Expected a Wolf slot');
    const selected = submitSelection(state, wolf.id);
    if (!selected.ok) throw new Error(selected.error.message);
    const hostView = createHostCardSelectionView(selected.value, 'host', 'host', 1_000);

    expect(hostView).toMatchObject({ ok: true, value: { teams: { wolf: { total: 3, ready: 1 }, sheep: { total: 3, ready: 0 } } } });
    expect(hostView.ok && JSON.stringify(hostView.value)).not.toMatch(/cardCategory|challengeId|Text/);
    expect(createHostCardSelectionView(state, 'host', wolf.id)).toMatchObject({
      ok: false, error: { code: 'NOT_AUTHORIZED' },
    });
  });
});
