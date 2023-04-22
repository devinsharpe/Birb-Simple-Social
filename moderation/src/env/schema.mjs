// @ts-check

import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  APP_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  TOXICITY_THRESHOLD: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive().max(100))
});
