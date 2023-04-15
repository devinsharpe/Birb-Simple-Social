import type { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import { user } from "../schema";
import { InferModel } from "drizzle-orm";

function Model<T extends MySqlTableWithColumns>(model: T) {
  type ModelObj = InferModel<T>;
  type InsertModel = InferModel<T, "insert">;
}
