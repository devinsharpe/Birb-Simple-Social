import type { MySql2Database } from "drizzle-orm/mysql2";
import type { Adapter, AdapterAccount } from "next-auth/adapters";
import { user } from "./schema";

export default function DrizzleMySql2Adapter(client: MySql2Database): Adapter {
  return {
    createUser: async (userObj) => {
      const result = await client.insert(user).values(userObj);
    },
  };
}
