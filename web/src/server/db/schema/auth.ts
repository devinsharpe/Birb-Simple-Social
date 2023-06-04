import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import type { ProviderType } from "next-auth/providers";

export const users = pgTable("users", {
  id: varchar("id", { length: 32 }).primaryKey(),
  name: varchar("name", { length: 256 }),
  email: varchar("email", { length: 256 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: varchar("userId", { length: 32 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<ProviderType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: varchar("userId", { length: 32 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

const authSchema = {
  users,
  accounts,
  sessions,
  verificationTokens,
};

export default authSchema;

export type AuthSchema = {
  users: typeof users;
  accounts: typeof accounts;
  sessions: typeof sessions;
  verificationTokens: typeof verificationTokens;
};
