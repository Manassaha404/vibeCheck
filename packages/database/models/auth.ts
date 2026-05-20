import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { userTable } from "./user.ts";

export const rolesEnum = pgEnum("roles", ["user" , "admin"]);

export const authTable = pgTable("auths", {
  id: uuid("id").primaryKey().defaultRandom(),
  password: varchar("password", { length: 255 }).notNull(),
  userId: uuid("user_id")
    .references(() => userTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  refreshToken: varchar("refresh_token"),
  verificationOtp: varchar("verification_otp"),
  verificationOtpExpiresAt: timestamp("verification_otp_expires_at"),
  passwordResetOtp: varchar("password_reset_otp"),
  passwordResetExpiresAt: timestamp("password_reset_expires_at"),
  role: rolesEnum("roles").default("user").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
