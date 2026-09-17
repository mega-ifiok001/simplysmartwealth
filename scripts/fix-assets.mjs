// Repairs asset references that were corrupted when the template was
// mirrored (original images saved as junk 404 .html pages).
// Run: node scripts/fix-assets.mjs
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// 1x1 transparent gif for unused plugin sprites
const blank =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// wave underline decorations (accent color #5869DA), recreated as inline SVG
const wavePath =
  "M0 2.5 Q 3.7 0 7.4 2.5 T 14.8 2.5 T 22.2 2.5 T 29.5 2.5 T 36.9 2.5 T 44.3 2.5 T 51.6 2.5 T 59 2.5";
const wave1 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='59' height='5' viewBox='0 0 59 5'%3E%3Cpath d='" +
  wavePath +
  "' fill='none' stroke='%235869da' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E";
const wave2 =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='59' height='11' viewBox='0 0 59 11'%3E%3Cpath d='" +
  wavePath +
  "' fill='none' stroke='%235869da' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M0 8.5 Q 3.7 6 7.4 8.5 T 14.8 8.5 T 22.2 8.5 T 29.5 8.5 T 36.9 8.5 T 44.3 8.5 T 51.6 8.5 T 59 8.5' fill='none' stroke='%235869da' stroke-width='2' stroke-linecap='round' opacity='0.5'/%3E%3C/svg%3E";

function patch(file, replacements) {
  const full = path.join(ROOT, file);
  let css = fs.readFileSync(full, "utf8");
  for (const [from, to] of replacements) {
    css = css.split(from).join(to);
  }
  fs.writeFileSync(full, css);
  console.log("patched", file);
}

patch("public/assets/css/style.css", [
  ["url(../imgs/theme/wave-line-1.html)", `url("${wave1}")`],
  ["url(../imgs/theme/wave-line-2.html)", `url("${wave2}")`],
]);
patch("public/assets/css/vendor/ticker-style.css", [
  ["url('../images/controls.html')", `url("${blank}")`],
]);
patch("public/assets/css/vendor/owl.carousel.min.css", [
  ["url(owl.video.play.html)", `url("${blank}")`],
]);

// ticker-style.css ships an uncompiled SCSS media block; the ticker plugin
// is unused by the site, so drop the block to keep PostCSS happy.
{
  const file = path.join(ROOT, "public/assets/css/vendor/ticker-style.css");
  let css = fs.readFileSync(file, "utf8");
  const before = css;
  css = css.replace(/\n\s*@media #\{\$xs\}\{\n\s*width: 200px;\n\s*\}/, "");
  if (css !== before) {
    fs.writeFileSync(file, css);
    console.log("removed uncompiled SCSS block from ticker-style.css");
  }
}

// remove the junk 404 pages left behind by the mirroring tool
const junk = [
  "public/assets/imgs/thumbnail-3.html",
  "public/assets/imgs/thumbnail-4.html",
  "public/assets/imgs/thumbnail-5.html",
  "public/assets/imgs/theme/wave-line-1.html",
  "public/assets/imgs/theme/wave-line-2.html",
  "public/assets/css/images/controls.html",
  "public/assets/css/vendor/owl.video.play.html",
];
for (const f of junk) {
  const full = path.join(ROOT, f);
  if (fs.existsSync(full)) {
    fs.rmSync(full);
    console.log("deleted", f);
  }
}
