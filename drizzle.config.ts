import { defineConfig } from "drizzle-kit";

// Support both SQLite (local) and MySQL/Postgres (production)
const databaseUrl = process.env.DATABASE_URL || "file:./local.db";
const isSQLite = databaseUrl.startsWith("file:");

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: isSQLite ? "sqlite" : "mysql",
  dbCredentials: isSQLite
    ? { url: databaseUrl }
    : { url: databaseUrl },
});
