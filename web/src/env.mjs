import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        // DATABASE SETTINGS
        PGLOGGING: z.enum(["true", "false"]),
        PGDATABASE: z.string(),
        PGHOST: z.string(),
        PGPASSWORD: z.string(),
        PGUSER: z.string(),
        // Node Env
        NODE_ENV: z.enum(["development", "test", "production"]),
        // Next Auth
        NEXTAUTH_SECRET:
            process.env.NODE_ENV === "production"
                ? z.string().min(1)
                : z.string().min(1).optional(),
        NEXTAUTH_URL: z.preprocess(
            // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
            // Since NextAuth.js automatically uses the VERCEL_URL if present.
            (str) => process.env.VERCEL_URL ?? str,
            // VERCEL_URL doesn't include `https` so it cant be validated as a URL
            process.env.VERCEL ? z.string() : z.string().url()
        ),
        // Next Auth - Apple
        APPLE_SERVICE_ID: z.string(),
        APPLE_KEY_ID: z.string(),
        APPLE_PRIVATE_KEY: z.string(),
        APPLE_SECRET: z.string(),
        APPLE_TEAM_ID: z.string(),
        // Next Auth - Google
        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),
        // Application hosts
        EMAIL_URL: z.string(),
        MODERATION_URL: z.string().url(),
        // S3 Settings
        S3_HOST_URL: z.string(),
        S3_UPLOAD_KEY: z.string(),
        S3_UPLOAD_SECRET: z.string(),
        S3_UPLOAD_BUCKET: z.string(),
        S3_UPLOAD_REGION: z.string(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
        NEXT_PUBLIC_ENV: z.enum(["development", "test", "production"]).default("production")
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        // Server Schema
        PGLOGGING: process.env.PGLOGGING,
        PGDATABASE: process.env.PGDATABASE,
        PGHOST: process.env.PGHOST,
        PGPASSWORD: process.env.PGPASSWORD,
        PGUSER: process.env.PGUSER,
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        APPLE_SERVICE_ID: process.env.APPLE_SERVICE_ID,
        APPLE_KEY_ID: process.env.APPLE_KEY_ID,
        APPLE_PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY,
        APPLE_SECRET: process.env.APPLE_SECRET,
        APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        EMAIL_URL: process.env.EMAIL_URL,
        MODERATION_URL: process.env.MODERATION_URL,
        S3_HOST_URL: process.env.S3_HOST_URL,
        S3_UPLOAD_KEY: process.env.S3_UPLOAD_KEY,
        S3_UPLOAD_BUCKET: process.env.S3_UPLOAD_BUCKET,
        S3_UPLOAD_REGION: process.env.S3_UPLOAD_REGION,
        S3_UPLOAD_SECRET: process.env.S3_UPLOAD_SECRET,
        // Client Schema
        NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV
        // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    },
});
