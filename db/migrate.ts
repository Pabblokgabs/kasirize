import "dotenv/config";
import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment");
  }

  console.log("Connecting to Neon via HTTP driver...");
  const sql = neon(connectionString);

  const migrationFilePath = path.join(
    process.cwd(),
    "db",
    "migrations",
    "0000_optimal_arclight.sql",
  );
  const sqlContent = fs.readFileSync(migrationFilePath, "utf8");

  const statements = sqlContent
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Executing ${statements.length} migration statements...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await sql.query(stmt);
      console.log(`[✓] Executed statement ${i + 1}/${statements.length}`);
    } catch (err: unknown) {
      const errorMsg = (err as Error)?.message || String(err);
      if (
        errorMsg.includes("already exists") ||
        errorMsg.includes("duplicate key")
      ) {
        console.log(`[!] Note on statement ${i + 1}: ${errorMsg.split("\n")[0]}`);
      } else {
        console.error(`[X] Error on statement ${i + 1}:`, errorMsg);
        throw err;
      }
    }
  }

  console.log("\n✅ All migrations applied successfully to Neon!");
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

