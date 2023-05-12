import NextAuth, { type NextAuthOptions } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import jwt from "jsonwebtoken";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

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
    EmailProvider({
      id: "email",
      async sendVerificationRequest(params) {
        await fetch(`${env.EMAIL_URL}api/magic`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: params.identifier,
            props: {
              url: params.url,
              supportUrl: `${env.NEXTAUTH_URL}support`,
            },
          }),
        });
      },
    }),
  ],
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  pages: {
    newUser: "/auth/new",
    verifyRequest: "/auth/verify",
  },
};

export default NextAuth(authOptions);
