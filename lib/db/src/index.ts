import * as dotenv from "dotenv";
import path from "path";

const envPath = process.env.INIT_CWD 
  ? path.resolve(process.env.INIT_CWD, ".env")
  : path.resolve(process.cwd(), ".env");

dotenv.config({ path: envPath });

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Add your Neon connection string to the .env file.",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("neon.tech") || process.env.DATABASE_URL.includes("supabase")
    ? { rejectUnauthorized: false }
    : false,
});

export const db = drizzle(pool, { schema });

export * from "./schema";