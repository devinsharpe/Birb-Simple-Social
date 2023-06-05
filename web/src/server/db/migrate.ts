import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
const { Pool } = pg;
dotenv.config();

const db = drizzle(
  new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.VERCEL_ENV ? undefined : 5432,
    ssl: !!process.env.VERCEL_ENV,
  })
);

migrate(db, "./drizzle.config.json")
  .then(() => {
    console.log("migrations applied");
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    console.log("migrations failed");
    process.exit(1);
  });
