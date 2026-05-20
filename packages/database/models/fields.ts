import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  pgEnum,
  boolean,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { formTable } from "./form";

export const fieldTypeEnum = pgEnum('field_type', [
  'short_text', 'long_text', 'email', 'number',
  'single_select', 'multi_select', 'checkbox',
  'rating', 'date'
])


export const fieldTable = pgTable("fields", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id").references(() => formTable.id, {
    onDelete: 'cascade'
  }).notNull(),
  orderIndex: integer('order_index').notNull(),
  type: fieldTypeEnum('type').notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  placeholder: varchar('placeholder', { length: 255 }),
  required: boolean('required').default(false).notNull(),
  options: jsonb('options'),
  validation: jsonb('validation'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
}, (table) => [
  index("form_id_idx").on(table.formId)
])