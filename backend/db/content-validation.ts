export interface CategoryContent {
  id: string;
  name: string;
  contentVersion: number;
  challenges: readonly { id: string; text: string; categoryId: string }[];
}

export function validateContent(categories: readonly CategoryContent[]): void {
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error('No valid game categories are available');
  }
  const ids = new Set<string>();
  for (const category of categories) {
    if (!category.id?.trim() || !category.name?.trim() || !Number.isInteger(category.contentVersion) || category.contentVersion < 1) {
      throw new Error('Game category content is malformed');
    }
    if (ids.has(category.id) || !Array.isArray(category.challenges) || category.challenges.length === 0 || category.challenges.length > 50) {
      throw new Error(`Game category ${category.id} has invalid challenge content`);
    }
    ids.add(category.id);
    const challengeIds = new Set<string>();
    for (const challenge of category.challenges) {
      if (!challenge.id?.trim() || !challenge.text?.trim() || challenge.categoryId !== category.id || challengeIds.has(challenge.id)) {
        throw new Error(`Game category ${category.id} contains malformed challenge content`);
      }
      challengeIds.add(challenge.id);
    }
  }
}
