import { describe, expect, it } from 'vitest';
import { bundledContent } from '../backend/db/bundled-content';
import { validateContent, type CategoryContent } from '../backend/db/content-validation';
import { prepareSessionPools } from '../backend/db/session-pool';
import type { RandomSource } from '../web-game/game/randomness';

const makeCategory = (count = 2): CategoryContent => ({
  id: 'animals',
  name: 'Animals',
  contentVersion: 1,
  challenges: Array.from({ length: count }, (_, index) => ({
    id: `challenge-${index + 1}`,
    text: `Challenge ${index + 1}`,
    categoryId: 'animals',
  })),
});

const zeroRandom: RandomSource = { nextInt: () => 0 };

describe('static game content validation', () => {
  it('accepts challenges owned by their valid category', () => {
    expect(() => validateContent([makeCategory()])).not.toThrow();
  });

  it('rejects challenges assigned to a missing or different category', () => {
    const category = makeCategory();
    const unowned = { ...category, challenges: [{ ...category.challenges[0], categoryId: 'missing' }] };
    expect(() => validateContent([unowned])).toThrow(/malformed challenge content/);
  });

  it('accepts 50 challenges and rejects 51 in one category', () => {
    expect(() => validateContent([makeCategory(50)])).not.toThrow();
    expect(() => validateContent([makeCategory(51)])).toThrow(/invalid challenge content/);
  });

  it('rejects empty content and malformed required category or challenge fields', () => {
    expect(() => validateContent([])).toThrow(/No valid game categories/);
    expect(() => validateContent([{ ...makeCategory(), name: '  ' }])).toThrow(/category content is malformed/);
    const category = makeCategory();
    expect(() => validateContent([{ ...category, challenges: [{ ...category.challenges[0], text: '  ' }] }]))
      .toThrow(/malformed challenge content/);
  });
});

describe('bundled startup content', () => {
  it('provides a non-empty, valid category catalog for database seeding', () => {
    expect(bundledContent.length).toBeGreaterThan(0);
    expect(() => validateContent(bundledContent)).not.toThrow();
  });

  it('uses Vietnamese category labels and challenge text without English-only copy', () => {
    const vietnameseText = bundledContent.flatMap(({ name, challenges }) => [
      name, ...challenges.map(({ text }) => text),
    ]);
    const vietnameseDiacritics = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i;

    expect(vietnameseText.length).toBeGreaterThan(0);
    expect(vietnameseText.every((text) => vietnameseDiacritics.test(text))).toBe(true);
  });
});

describe('session challenge pools', () => {
  it('limits each category to ten challenges and selects deterministically with controlled randomness', () => {
    const category = makeCategory(50);
    const first = prepareSessionPools([category], zeroRandom);
    const second = prepareSessionPools([category], zeroRandom);

    expect(first[0].challenges).toHaveLength(10);
    expect(first).toEqual(second);
    expect(first[0].challenges.map(({ id }) => id)).toEqual(
      ['challenge-2', 'challenge-3', 'challenge-4', 'challenge-5', 'challenge-6', 'challenge-7', 'challenge-8', 'challenge-9', 'challenge-10', 'challenge-11'],
    );
  });
});
