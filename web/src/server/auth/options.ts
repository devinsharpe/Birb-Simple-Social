import type { NextAuthOptions } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapterPg } from "~/server/db/adapter";
import db from "~/server/db";
import { env } from "~/env.mjs";
import authSchema from "~/server/db/schema/auth";

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
  // adapter: PrismaAdapter(prisma),
  adapter: DrizzleAdapterPg(db, authSchema),
  providers: [
    AppleProvider({
      clientId: env.APPLE_SERVICE_ID,
      clientSecret: env.APPLE_SECRET,
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

export default authOptions;
