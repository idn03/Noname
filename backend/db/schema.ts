import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  contentVersion: integer('content_version').notNull(),
});

export const challenges = sqliteTable('challenges', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
}, (table) => [index('challenges_category_id_idx').on(table.categoryId)]);
