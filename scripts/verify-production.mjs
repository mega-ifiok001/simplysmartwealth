import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";

const root = fileURLToPath(new URL("../", import.meta.url));
const build = path.join(root, ".next-production");
const app = path.join(build, "server", "app");
const manifest = JSON.parse(fs.readFileSync(path.join(build, "prerender-manifest.json"), "utf8"));
const routeManifest = JSON.parse(fs.readFileSync(path.join(build, "routes-manifest.json"), "utf8"));
// Exact routes may now be rendered on demand (for example the homepage).
const routes = new Set([...Object.keys(manifest.routes), ...routeManifest.staticRoutes.map(route => route.page)]);
const failures = [];
let pages = 0;
let references = 0;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

for (const file of walk(app).filter(file => file.endsWith(".html"))) {
  pages++;
  const relative = path.relative(app, file).replaceAll("\\", "/");
  const route = relative === "index.html" ? "/" : `/${relative.slice(0, -5)}`;
  const $ = load(fs.readFileSync(file, "utf8"));
  $("[href], [src]").each((_, element) => {
    for (const attribute of ["href", "src"]) {
      const value = $(element).attr(attribute);
      if (value === undefined) continue;
      references++;
      if (!value || value.startsWith("#")) continue;
      let url;
      try { url = new URL(value, `http://migration.local${route}`); }
      catch { failures.push({ page: route, attribute, value, reason: "Invalid URL" }); continue; }
      if (url.origin !== "http://migration.local") continue;
      const pathname = decodeURIComponent(url.pathname);
      const normalized = pathname.replace(/\/$/, "") || "/";
      // The template's explicit 404 demo intentionally invokes Next's not-found page.
      if (normalized === "/404" && fs.existsSync(path.join(app, "_not-found.html"))) continue;
      if (routes.has(normalized)) continue;
      const asset = pathname.startsWith("/_next/")
        ? path.join(build, pathname.slice("/_next/".length))
        : path.join(root, "public", pathname);
      if (fs.existsSync(asset) && fs.statSync(asset).isFile()) continue;
      failures.push({ page: route, attribute, value, reason: "No built route or asset" });
    }
  });
}

const unique = [...new Map(failures.map(item => [JSON.stringify(item), item])).values()];
console.log(JSON.stringify({ pages, references, failures: unique }, null, 2));
if (!pages || unique.length) process.exitCode = 1;
