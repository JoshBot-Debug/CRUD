import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}`, quiet: true });

export default defineConfig({
  out: './app/.server/api/drizzle',
  dialect: 'postgresql',
  schema: './app/.server/api/db/schema.ts',
  dbCredentials: {
    url: process.env.VITE_DATABASE_URL!,
  },
})
