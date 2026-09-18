#!/usr/bin/env node
/**
 * Database backup/restore helper for PostgreSQL deployments.
 *
 *   node scripts/backup-db.mjs backup [output-file]
 *   node scripts/backup-db.mjs restore <input-file>
 *
 * Requires the PostgreSQL client tools (`pg_dump` and `pg_restore`) on PATH.
 * The connection string is taken from DIRECT_URL (falling back to
 * DATABASE_URL). For Neon, DIRECT_URL is the non-pooled endpoint that
 * schema tools and dump utilities must use.
 */
import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import process from "node:process";

const command = process.argv[2];
const fileArg = process.argv[3];

function fail(message) {
  console.error(`backup-db: ${message}`);
  process.exit(1);
}

function tool(name) {
  const probe = spawnSync(name, ["--version"], { encoding: "utf8", shell: false });
  if (probe.error || probe.status !== 0) {
    fail(`\`${name}\` was not found on PATH. Install the PostgreSQL client tools and try again.`);
  }
}

function connectionUrl() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) fail("Set DIRECT_URL (or DATABASE_URL) in the environment before running a backup.");
  return url;
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");

if (command === "backup") {
  tool("pg_dump");
  const output = fileArg || `backups/db-${stamp}.dump`;
  const result = spawnSync("pg_dump", ["--format=custom", "--no-owner", "--file=" + output, connectionUrl()], {
    stdio: "inherit",
    shell: false,
  });
  if (result.error || result.status !== 0) fail("pg_dump failed; no backup file should be trusted.");
  if (!existsSync(output) || statSync(output).size === 0) fail("pg_dump produced no output.");
  console.log(`backup-db: wrote ${output}`);
} else if (command === "restore") {
  tool("pg_restore");
  if (!fileArg) fail("Usage: node scripts/backup-db.mjs restore <input-file>");
  if (!existsSync(fileArg)) fail(`Input file not found: ${fileArg}`);
  console.log("backup-db: WARNING — restore overwrites matching objects in the target database.");
  console.log("backup-db: target:", connectionUrl().replace(/:[^:@/]+@/, ":***@"));
  const result = spawnSync("pg_restore", ["--no-owner", "--clean", "--if-exists", "--dbname=" + connectionUrl(), fileArg], {
    stdio: "inherit",
    shell: false,
  });
  if (result.error || result.status !== 0) fail("pg_restore reported errors; inspect the output above.");
  console.log("backup-db: restore finished");
} else {
  fail("Usage: node scripts/backup-db.mjs <backup [output-file] | restore <input-file>>");
}