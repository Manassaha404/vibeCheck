import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  pgEnum,
  boolean,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { userTable } from "./user.ts";

export const visibilityEnum = pgEnum('visibility', ['public', 'unlisted', 'draft'])

export const formTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userTable.id, {
    onDelete: "cascade"
  }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 150 }).notNull(),
  description: text('description'),
  visibility: visibilityEnum('visibility').default('draft').notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  allowResponseEdit: boolean('allow_response_edit').default(false).notNull(),
  responseLimit: integer('response_limit'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex('slug_idx').on(table.slug)
])