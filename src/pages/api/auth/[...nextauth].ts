import NextAuth, {
  type Account,
  type User,
  type NextAuthOptions,
} from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import jwt from "jsonwebtoken";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

const accountHandleRegex = /^@?(\w){1,15}$/;

const customConfig: Config = {
  dictionaries: [adjectives, colors],
  separator: "-",
  length: 2,
};

const setupAccount = async (user: User) => {
  const account = await prisma.account.findFirstOrThrow({
    where: { userId: user.id },
  });
  await prisma.profile.create({
    data: {
      firstName: "",
      lastName: "",
      handle: uniqueNamesGenerator(customConfig),
      accountId: account.id,
    },
  });
  console.log(account);
  console.log(user);
  console.log(uniqueNamesGenerator(customConfig));
  return true;
};

const generateAppleSecret = () =>
  jwt.sign(
    {
      iat: new Date().getTime() / 1000,
    },
    `${env.APPLE_PRIVATE_KEY}`,
    {
      audience: "https://appleid.apple.com",
      issuer: env.APPLE_TEAM_ID,
      expiresIn: env.NODE_ENV === "development" ? "24h" : "2h",
      header: {
        alg: "ES256",
        kid: env.APPLE_KEY_ID,
      },
      subject: env.APPLE_SERVICE_ID,
    }
  );

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    signIn: ({ account, user }) => setupAccount(user),
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    AppleProvider({
      clientId: env.APPLE_SERVICE_ID,
      clientSecret: generateAppleSecret(),
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
