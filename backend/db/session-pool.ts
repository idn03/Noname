import type { CategoryContent } from './content-validation';
import { validateContent } from './content-validation';
import { shuffled, type RandomSource } from '../../web-game/game/randomness';

export interface SessionCategoryPool {
  categoryId: string;
  challenges: readonly { id: string; text: string }[];
}

export function prepareSessionPools(
  categories: readonly CategoryContent[],
  random: RandomSource,
): readonly SessionCategoryPool[] {
  validateContent(categories);
  return categories.map((category) => ({
    categoryId: category.id,
    challenges: shuffled(category.challenges, random).slice(0, 10).map(({ id, text }) => ({ id, text })),
  }));
}
