import type { Adapter } from "next-auth/adapters";
import type { DbClient } from "./";
import type { AuthSchema } from "./schema/auth";
import { and, eq } from "drizzle-orm";

import { createId } from "./utils";

export function DrizzleAdapterPg(
  client: DbClient,
  { users, sessions, verificationTokens, accounts }: AuthSchema
): Adapter {
  return {
    createUser: async (data) => {
      const user = await client
        .insert(users)
        .values({ ...data, id: createId() })
        .returning()
        .then((res) => res[0]);
      if (user) return user;
      throw new Error("User creation failed");
    },
    getUser: async (data) => {
      const user = await client
        .select()
        .from(users)
        .where(eq(users.id, data))
        .then((res) => res[0]);
      if (user) return user;
      return null;
    },
    getUserByEmail: async (data) => {
      const user = await client
        .select()
        .from(users)
        .where(eq(users.email, data))
        .then((res) => res[0]);
      if (user) return user;
      return null;
    },
    createSession: async (data) => {
      const session = await client
        .insert(sessions)
        .values(data)
        .returning()
        .then((res) => res[0]);
      if (session) return session;
      throw new Error("Session creation failed");
    },
    getSessionAndUser: async (data) => {
      const sessionUser =
        (await client
          .select({
            session: sessions,
            user: users,
          })
          .from(sessions)
          .where(eq(sessions.sessionToken, data))
          .innerJoin(users, eq(users.id, sessions.userId))
          .then((res) => res[0])) ?? null;
      if (sessionUser) return sessionUser;
      return null;
    },
    updateUser: async (data) => {
      if (!data.id) {
        throw new Error("No user id.");
      }

      const user = await client
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning()
        .then((res) => res[0]);
      if (user) return user;
      throw new Error("User update failed");
    },
    updateSession: async (data) => {
      return client
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .then((res) => res[0]);
    },
    linkAccount: async (rawAccount) => {
      const updatedAccount = await client
        .insert(accounts)
        .values(rawAccount)
        .returning()
        .then((res) => res[0]);

      if (!updatedAccount) throw new Error("Account update failed");

      // Drizzle will return `null` for fields that are not defined.
      // However, the return type is expecting `undefined`.
      const account: ReturnType<Adapter["linkAccount"]> = {
        ...updatedAccount,
        access_token: updatedAccount?.access_token ?? undefined,
        token_type: updatedAccount?.token_type ?? undefined,
        id_token: updatedAccount?.id_token ?? undefined,
        refresh_token: updatedAccount?.refresh_token ?? undefined,
        scope: updatedAccount?.scope ?? undefined,
        expires_at: updatedAccount?.expires_at ?? undefined,
        session_state: updatedAccount?.session_state ?? undefined,
      };

      return account;
    },
    getUserByAccount: async (account) => {
      const user = await client
        .select()
        .from(users)
        .innerJoin(
          accounts,
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )
        .then((res) => res[0]);
      if (user) return user.users;
      return null;
    },
    deleteSession: async (sessionToken) => {
      await client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken));
    },
    createVerificationToken: async (token) => {
      return client
        .insert(verificationTokens)
        .values(token)
        .returning()
        .then((res) => res[0]);
    },
    useVerificationToken: async (token) => {
      const verificationToken =
        (await client
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token)
            )
          )
          .returning()
          .then((res) => res[0])) ?? null;
      if (verificationToken) return verificationToken;
      return verificationToken;
    },
    deleteUser: async (id) => {
      await client
        .delete(users)
        .where(eq(users.id, id))
        .returning()
        .then((res) => res[0]);
    },
    unlinkAccount: async (account) => {
      await client
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        );

      return undefined;
    },
  };
}
