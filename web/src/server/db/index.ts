import { drizzle } from "drizzle-orm/neon-serverless";
import { env } from "~/env/server.mjs";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import logger from "./utils/logger";

if (!process.env.VERCEL_ENV) {
  neonConfig.wsProxy = (host) => `${host}:5433/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

const db = drizzle(new Pool({ connectionString: env.POSTGRES_URL }), {
  logger: env.POSTGRES_LOGGING === "true" ? logger : false,
});

export default db;

migrate(db, { migrationsFolder: "./src/server/db/migrations/" })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  .then(() => {})
  .catch((err) => {
    console.log(err);
    console.log("migrations failed");
  });

export type DbClient = typeof db;
