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
import { fieldTable } from "./fields";
import { responseTable } from "./responce";

export const answerTable = pgTable(
  "answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fieldId: uuid("field_id")
      .references(() => fieldTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    responseId: uuid("response_id")
      .references(() => responseTable.id, {
        onDelete: "cascade"
      })
      .notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => [
    index("answer_field_id_idx").on(table.fieldId),
    index("answer_response_id").on(table.responseId),
  ],
);
