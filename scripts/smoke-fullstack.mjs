import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
const root = fileURLToPath(new URL("../", import.meta.url));
const port = 3198;
const origin = `http://127.0.0.1:${port}`;
// Deliberately never use real service credentials in this smoke test.
const env = { ...process.env, NODE_ENV: "production", DATABASE_URL: "", DIRECT_URL: "",
  NEXTAUTH_URL: origin, NEXTAUTH_SECRET: randomBytes(32).toString("hex"),
  CLOUDINARY_API_SECRET: "", CLOUDINARY_API_KEY: "" };
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: root, env, stdio: ["ignore", "pipe", "pipe"] });
let logs = "";
server.stdout.on("data", data => { logs += data.toString(); });
server.stderr.on("data", data => { logs += data.toString(); });
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error("Test server exited before startup.");
    try { const res = await fetch(`${origin}/api/auth/providers`); if (res.ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert.ok(ready, "Production server starts");
  for (const route of ["/", "/contact", "/admin/login"]) {
    const res = await fetch(`${origin}${route}`);
    assert.equal(res.status, 200, route);
    const html = await res.text();
    if (route === "/admin/login") {
      assert.ok(html.includes("Administrator sign in"));
      assert.ok(!html.includes('<header class="main-header'), "Admin excludes public header");
    }
    console.log(`PASS: ${route} returns 200`);
  }
  for (const route of ["/admin", "/admin/posts/new", "/admin/posts/not-a-post/edit", "/admin/categories", "/admin/comments", "/admin/inbox", "/admin/settings"]) {
    const res = await fetch(`${origin}${route}`, { redirect: "manual" });
    assert.equal(res.status, 307, route);
    assert.equal(res.headers.get("location"), "/admin/login");
    console.log(`PASS: unauthenticated ${route} redirects to login`);
  }
  const csrf = await fetch(`${origin}/api/auth/csrf`);
  assert.ok((await csrf.json()).csrfToken, "NextAuth provides CSRF token");
  const session = await fetch(`${origin}/api/auth/session`);
  assert.deepEqual(await session.json(), {}, "No unauthenticated session");
  const missing = await fetch(`${origin}/posts/nonexistent-article`);
  assert.equal(missing.status, 404);
  console.log("PASS: CSRF endpoint, empty session, and missing article 404");
  console.log("Database login, mutations, and Cloudinary uploads NOT tested: credentials required.");
} catch (error) {
  console.error(error);
  console.error(logs.slice(-6000));
  process.exitCode = 1;
} finally {
  server.kill();
}
