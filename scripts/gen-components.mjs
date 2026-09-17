// Generates shared layout components from tmp/generated/blocks/*.jsx
// Run: node scripts/gen-components.mjs
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const GEN = path.join(ROOT, "tmp", "generated", "blocks");
const OUT = path.join(ROOT, "components", "layout");
fs.mkdirSync(OUT, { recursive: true });

function read(name) {
  return fs
    .readFileSync(path.join(GEN, `${name}.jsx`), "utf8")
    .replace(/^<!--[^>]*-->\s*/, "")
    .trim();
}

// ------------------------------------------------------------------ Header
let header = read("header")
  .replace(
    '<button className="search-icon d-none d-md-inline">',
    '<button className="search-icon d-none d-md-inline" onClick={toggleSearch} aria-label="Search">'
  )
  .replace(
    '<a className="dark-light-mode" href="#"></a>',
    '<a className="dark-light-mode" href="#" onClick={toggleTheme} aria-label="Toggle dark mode"></a>'
  )
  .replace(
    '<div className="off-canvas-toggle hidden d-inline-block" id="off-canvas-toggle"><span></span></div>',
    '<div className="off-canvas-toggle hidden d-inline-block" id="off-canvas-toggle" onClick={openSidebar} role="button" aria-label="Open menu"><span></span></div>'
  )
  .replace(
    '<div className="header-sticky">',
    '<div className={`header-sticky${scrolled ? " sticky-bar" : ""}`}>'
  );

fs.writeFileSync(
  path.join(OUT, "Header.tsx"),
  `"use client";

import { useUI } from "@/components/ClientLayout";

function toggleSearch() {
  document.body.classList.toggle("open-search-form");
  document.querySelectorAll(".mega-menu-item").forEach((el) => el.classList.remove("open"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleTheme(e: React.MouseEvent) {
  e.preventDefault();
  const dark = document.body.classList.toggle("dark");
  const btn = document.querySelector(".dark-light-mode");
  if (btn) btn.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}

function openSidebar() {
  document.body.classList.add("canvas-opened");
}

export default function Header() {
  const { scrolled } = useUI();
  return (
${header}
  );
}
`
);

// -------------------------------------------------------- OffcanvasSidebar
const offcanvas = read("offcanvas")
  .replace(
    '<button className="off-canvas-close">',
    '<button className="off-canvas-close" onClick={closeSidebar} aria-label="Close menu">'
  );

fs.writeFileSync(
  path.join(OUT, "OffcanvasSidebar.tsx"),
  `"use client";

function closeSidebar() {
  document.body.classList.remove("canvas-opened");
}

export default function OffcanvasSidebar() {
  return (
${offcanvas}
  );
}
`
);

// ------------------------------------------------------------ SearchOverlay
fs.writeFileSync(
  path.join(OUT, "SearchOverlay.tsx"),
  `export default function SearchOverlay() {
  return (
${read("searchForm")}
  );
}
`
);

// -------------------------------------------------------------- SiteBottom
fs.writeFileSync(
  path.join(OUT, "SiteBottom.tsx"),
  `export default function SiteBottom() {
  return (
${read("siteBottom")}
  );
}
`
);

// ------------------------------------------------------------------ Footer
const footer = read("footer").replace(
  '<footer className="pt-50 pb-20 bg-grey">',
  '<footer className={"pt-50 pb-20" + (variant === "plain" ? "" : " bg-grey")}>'
);

fs.writeFileSync(
  path.join(OUT, "Footer.tsx"),
  `export default function Footer({
  variant = "default",
}: {
  variant?: "default" | "plain";
}) {
  return (
${footer}
  );
}
`
);

console.log("components written to", OUT);
