import { Pool, neonConfig } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-serverless";
// import { env } from "~/env/server.mjs";
import { env } from "~/env.mjs";
import logger from "./utils/logger";
import schema from "./schema";

if (!process.env.VERCEL_ENV) {
  neonConfig.wsProxy = (host) => `${host}:5433/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

const db = drizzle(
  new Pool({
    host: env.PGHOST,
    user: env.PGUSER,
    password: env.PGPASSWORD,
    database: env.PGDATABASE,
    port: process.env.VERCEL_ENV ? undefined : 5433,
  }),
  {
    logger: env.PGLOGGING === "true" ? logger : false,
    schema,
  }
);

export default db;

export type DbClient = typeof db;
