import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { loadGameContent } from './content-repository';
import * as schema from './schema';
import { seedBundledContent } from './seed-content';

export async function openContentDatabase() {
  const directory = join(process.cwd(), '.data');
  await mkdir(directory, { recursive: true });
  const client = createClient({ url: `file:${join(directory, 'noname.db')}` });
  const database = drizzle(client, { schema });
  const migrationsFolder = fileURLToPath(new URL('./migrations', import.meta.url));
  try {
    await migrate(database, { migrationsFolder });
    await seedBundledContent(database);
    const content = await loadGameContent(database);
    return { database, client, content };
  } catch (error) {
    console.error('Failed to initialize local game content database', error);
    client.close();
    throw new Error('Local game content storage could not be initialized');
  }
}
