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
  index,
} from "drizzle-orm/pg-core";
import { formTable } from "./form";

export const responseTable = pgTable(
  "responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").references(() => formTable.id, {
      onDelete: "cascade",
    }).notNull(),
    guestToken: varchar("guest_token").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => [
    index("response_form_id_idx").on(table.formId),
    index("guest_token_idx").on(table.guestToken),
  ],
)
