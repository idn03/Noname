import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import { bundledContent } from './bundled-content';
import { validateContent } from './content-validation';
import * as schema from './schema';

export async function seedBundledContent(database: LibSQLDatabase<typeof schema>): Promise<void> {
  validateContent(bundledContent);
  await database.transaction(async (transaction) => {
    const existing = await transaction.select().from(schema.categories);
    const bundledIds = new Set(bundledContent.map(({ id }) => id));
    for (const category of existing) {
      if (!bundledIds.has(category.id)) {
        await transaction.delete(schema.categories).where(eq(schema.categories.id, category.id));
      }
    }
    const current = existing.filter(({ id }) => bundledIds.has(id));
    if (current.length > 0) {
      for (const category of bundledContent) {
        const stored = current.find((entry) => entry.id === category.id);
        if (stored && (stored.name !== category.name || stored.contentVersion !== category.contentVersion)) {
          throw new Error('Stored game content version is incompatible with bundled content');
        }
      }
      const missing = bundledContent.filter(({ id }) => !current.some((entry) => entry.id === id));
      for (const category of missing) {
        await transaction.insert(schema.categories).values({
          id: category.id, name: category.name, contentVersion: category.contentVersion,
        });
        await transaction.insert(schema.challenges).values(category.challenges.map(({ id, text }) => ({
          id, text, categoryId: category.id,
        })));
      }
      return;
    }
    const orphanChallenges = await transaction.select().from(schema.challenges);
    if (orphanChallenges.length > 0) throw new Error('Stored game content is malformed');
    for (const category of bundledContent) {
      await transaction.insert(schema.categories).values({
        id: category.id, name: category.name, contentVersion: category.contentVersion,
      });
      await transaction.insert(schema.challenges).values(category.challenges.map(({ id, text }) => ({
        id, text, categoryId: category.id,
      })));
    }
  });
}
