// Extract shared blocks from each HTML page and report which are identical.
// Run: node scripts/extract-blocks.mjs
import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

const ROOT = path.resolve(import.meta.dirname, "..");

const pages = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith(".html"))
  .sort();

const MARKERS = {
  offcanvas: ["<!--Offcanvas sidebar-->", "<!-- Start Header -->"],
  header: ["<!-- Start Header -->", "<!--Start search form-->"],
  searchForm: ["<!--Start search form-->", "<!-- Start Main content -->"],
  mainContent: ["<!-- Start Main content -->", "<!-- End Main content -->"],
  siteBottom: ["<!--site-bottom-->", "<!-- Footer Start-->"],
  footer: ["<!-- Footer Start-->", "<!-- End Footer -->"],
};

function cut(html, [start, end]) {
  const i = html.indexOf(start);
  if (i === -1) return null;
  const j = html.indexOf(end, i);
  if (j === -1) return null;
  return html.slice(i, j).trim();
}

const blocks = {};
for (const page of pages) {
  const html = fs.readFileSync(path.join(ROOT, page), "utf8");
  blocks[page] = {};
  for (const [name, markers] of Object.entries(MARKERS)) {
    const fragment = cut(html, markers);
    if (fragment === null) {
      blocks[page][name] = null;
    } else {
      blocks[page][name] = crypto
        .createHash("md5")
        .update(fragment.replace(/\s+/g, " "))
        .digest("hex")
        .slice(0, 10);
    }
  }
}

// Report per block: groups of identical hash values
const names = Object.keys(MARKERS);
const summary = {};
for (const name of names) {
  const groups = {};
  for (const page of pages) {
    const h = blocks[page][name] ?? "MISSING";
    (groups[h] ||= []).push(page);
  }
  summary[name] = Object.entries(groups).map(([h, pgs]) => ({ hash: h, pages: pgs }));
}

for (const name of names) {
  console.log(`\n=== ${name} ===`);
  for (const g of summary[name]) {
    console.log(`  ${g.hash}  (${g.pages.length})  ${g.pages.join(", ")}`);
  }
}

// Also report page structure oddities
console.log("\n=== pages missing any marker ===");
for (const page of pages) {
  const missing = names.filter((n) => blocks[page][n] === null);
  if (missing.length) console.log(`  ${page}: ${missing.join(", ")}`);
}
