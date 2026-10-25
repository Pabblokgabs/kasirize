import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { execFileSync } from "node:child_process";
import * as schema from "./schema/index";

const connectionString = process.env.DATABASE_URL || "";

/**
 * Robust parameter interpolator to safely map Drizzle $1, $2 placeholders
 * for Neon HTTP execution across sandboxed or cloud environments.
 */
function interpolateSql(query: string, params?: unknown[]): string {
  if (!params || params.length === 0) return query;
  return query.replace(/\$([0-9]+)/g, (_, idx) => {
    const val = params[parseInt(idx, 10) - 1];
    if (val === null || val === undefined) return "NULL";
    if (typeof val === "number") return String(val);
    if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
    if (Array.isArray(val)) {
      // Postgres array literal format e.g. ARRAY['a', 'b']
      const elements = val.map((item) => `'${String(item).replace(/'/g, "''")}'`);
      return `ARRAY[${elements.join(", ")}]`;
    }
    return `'${String(val).replace(/'/g, "''")}'`;
  });
}

// Intercept Neon fetchFunction to execute via clean curl subprocess
neonConfig.fetchFunction = async (url: string, opts?: { body?: unknown }) => {
  try {
    const parsedBody =
      typeof opts?.body === "string"
        ? (JSON.parse(opts.body) as { query: string; params?: unknown[] })
        : (opts?.body as { query: string; params?: unknown[] }) || { query: "" };
    const sqlQuery = interpolateSql(parsedBody.query, parsedBody.params);
    const payload = JSON.stringify({ query: sqlQuery });

    // Clean env to avoid shell hook conflicts (e.g., Console Ninja)
    const cleanEnv = { ...process.env };
    delete cleanEnv.LD_PRELOAD;
    delete cleanEnv.NODE_OPTIONS;

    const out = execFileSync(
      "curl",
      [
        "-s",
        "-X", "POST",
        url,
        "-H", `Neon-Connection-String: ${connectionString}`,
        "-H", "Content-Type: application/json",
        "-H", "Neon-Array-Mode: true",
        "-H", "Neon-Raw-Text-Output: true",
        "-d", payload,
      ],
      { encoding: "utf-8", env: cleanEnv },
    );

    return new Response(out, {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("Neon HTTP bridge error:", err);
    throw err;
  }
};

// Neon HTTP serverless client
const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

export { schema };
export * from "./schema/index";

