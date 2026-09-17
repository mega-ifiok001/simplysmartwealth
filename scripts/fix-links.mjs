// One-off codemod: replace stale template .html links with real routes/assets.
import fs from "node:fs";
import path from "node:path";

const roots = ["app", "components"];
const replacements = [
  [/href="author\.html"/g, 'href="/author"'],
  [/href="assets\/imgs\/thumbnail-3\.html"/g, 'href="/assets/imgs/news/thumb-1.jpg"'],
  [/href="assets\/imgs\/thumbnail-4\.html"/g, 'href="/assets/imgs/news/thumb-2.jpg"'],
  [/href="assets\/imgs\/thumbnail-5\.html"/g, 'href="/assets/imgs/news/thumb-3.jpg"'],
];

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith(".tsx")) {
      let src = fs.readFileSync(p, "utf8");
      const orig = src;
      for (const [re, to] of replacements) src = src.replace(re, to);
      if (src !== orig) {
        fs.writeFileSync(p, src);
        console.log("fixed:", p);
      }
    }
  }
}

for (const r of roots) {
  if (fs.existsSync(r)) walk(r);
}
console.log("done");
