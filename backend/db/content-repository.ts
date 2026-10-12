import { asc, eq } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { validateContent, type CategoryContent } from './content-validation';

export async function loadGameContent(database: LibSQLDatabase<typeof schema>): Promise<CategoryContent[]> {
  const rows = await database.select().from(schema.categories).orderBy(asc(schema.categories.id));
  const challengeRows = await database.select().from(schema.challenges).orderBy(asc(schema.challenges.id));
  const content = rows.map((category) => ({
    ...category,
    challenges: challengeRows.filter((challenge) => challenge.categoryId === category.id),
  }));
  if (challengeRows.some((challenge) => !rows.some((category) => category.id === challenge.categoryId))) {
    throw new Error('Game content contains a challenge without a category');
  }
  validateContent(content);
  return content;
}
