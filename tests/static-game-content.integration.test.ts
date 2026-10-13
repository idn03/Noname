import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { describe, expect, it } from 'vitest';
import { bundledContent } from '../backend/db/bundled-content';
import { loadGameContent } from '../backend/db/content-repository';
import * as schema from '../backend/db/schema';
import { seedBundledContent } from '../backend/db/seed-content';

async function createMigratedDatabase() {
  const directory = await mkdtemp(join(tmpdir(), 'noname-content-'));
  const client = createClient({ url: `file:${join(directory, 'test.db')}` });
  const database = drizzle(client, { schema });
  const migrationsFolder = fileURLToPath(new URL('../backend/db/migrations', import.meta.url));
  await migrate(database, { migrationsFolder });
  return { client, database, directory };
}

describe('static game content database integration', () => {
  it('migrates, seeds idempotently, and loads the bundled catalog', async () => {
    const { client, database, directory } = await createMigratedDatabase();
    try {
      await seedBundledContent(database);
      const firstLoad = await loadGameContent(database);
      await seedBundledContent(database);

      expect(firstLoad).toHaveLength(bundledContent.length);
      expect(await loadGameContent(database)).toEqual(firstLoad);
      expect(firstLoad.flatMap(({ challenges }) => challenges)).toHaveLength(
        bundledContent.reduce((count, category) => count + category.challenges.length, 0),
      );
    } finally {
      client.close();
      await rm(directory, { recursive: true, force: true });
    }
  });

  it('rejects malformed persisted content when loading', async () => {
    const { client, database, directory } = await createMigratedDatabase();
    try {
      await database.insert(schema.categories).values({
        id: 'broken', name: 'Broken', contentVersion: 1,
      });

      await expect(loadGameContent(database)).rejects.toThrow(/invalid challenge content/);
    } finally {
      client.close();
      await rm(directory, { recursive: true, force: true });
    }
  });
});
