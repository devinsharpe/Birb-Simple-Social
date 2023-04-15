import { drizzle } from "drizzle-orm/mysql2";

import mysql from "mysql2/promise";
import "./schema";
import { env } from "../env/server.mjs";

const poolConnection = mysql.createPool({
  uri: env.DATABASE_URL,
});

const db = drizzle(poolConnection);

export default db;
