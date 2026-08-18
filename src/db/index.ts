import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

export const db = databaseUrl
  ? drizzle(new Pool({ connectionString: databaseUrl }))
  : null;
