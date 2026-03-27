import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // For serverless Postgres (Neon/Supabase), Prisma CLI should use a direct URL.
    // Fallback to DATABASE_URL so local development keeps working without extra setup.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
