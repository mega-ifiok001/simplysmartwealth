// Generates app router pages from tmp/generated/pages/*.jsx
// Run: node scripts/gen-app.mjs
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const GEN = path.join(ROOT, "tmp", "generated");
const APP = path.join(ROOT, "app");

const ROUTES = {
  "__home.jsx": { dir: ".", name: "Home" },
  "home-2.jsx": { dir: "home-2", name: "Home2" },
  "home-3.jsx": { dir: "home-3", name: "Home3" },
  "category.jsx": { dir: "category", name: "Category" },
  "category-big.jsx": { dir: "category-big", name: "CategoryBig" },
  "category-grid.jsx": { dir: "category-grid", name: "CategoryGrid" },
  "category-list.jsx": { dir: "category-list", name: "CategoryList" },
  "category-masonry.jsx": { dir: "category-masonry", name: "CategoryMasonry" },
  "single.jsx": { dir: "single", name: "Single" },
  "single-2.jsx": { dir: "single-2", name: "Single2" },
  "single-3.jsx": { dir: "single-3", name: "Single3" },
  "single-4.jsx": { dir: "single-4", name: "Single4" },
  "about.jsx": { dir: "about", name: "About" },
  "contact.jsx": { dir: "contact", name: "Contact" },
  "login.jsx": { dir: "login", name: "Login" },
  "register.jsx": { dir: "register", name: "Register" },
  "search.jsx": { dir: "search", name: "Search" },
  "typography.jsx": { dir: "typography", name: "Typography" },
  "author.jsx": { dir: "author", name: "Author" },
};

// pages that skip the site-bottom widget strip (verified from the HTML source)
const NO_SITE_BOTTOM = new Set([
  "category", "category-list", "author", "login", "register", "search",
  "single-4",
]);
// pages using the plain (non bg-grey) footer variant
const PLAIN_FOOTER = new Set(["login", "register"]);

for (const [file, meta] of Object.entries(ROUTES)) {
  const content = fs.readFileSync(path.join(GEN, "pages", file), "utf8").trim();
  const dirName = meta.dir === "." ? "" : meta.dir;
  const outDir = path.join(APP, dirName);
  fs.mkdirSync(outDir, { recursive: true });

  const usesSiteBottom = !NO_SITE_BOTTOM.has(meta.name);
  const footerVariant = PLAIN_FOOTER.has(meta.name) ? "plain" : "default";

  const tsx = `import Behaviors from "@/components/Behaviors";
import Footer from "@/components/layout/Footer";
${usesSiteBottom ? 'import SiteBottom from "@/components/layout/SiteBottom";\n' : ""}
export const metadata = {
  title: "Simply Smart Wealth - ${meta.name}",
};

export default function ${meta.name}Page() {
  return (
    <>
${content}

\t\t\t<Behaviors />
${usesSiteBottom ? "\t\t\t<SiteBottom />\n" : ""}\t\t\t<Footer variant="${footerVariant}" />
    </>
  );
}
`;
  fs.writeFileSync(path.join(outDir, "page.tsx"), tsx);
  console.log(`wrote app/${dirName ? dirName + "/" : ""}page.tsx`);
}

// not-found from the 404 page content
const notFoundContent = fs.readFileSync(path.join(GEN, "pages", "404.jsx"), "utf8").trim();
fs.writeFileSync(
  path.join(APP, "not-found.tsx"),
  `import Behaviors from "@/components/Behaviors";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Page not found - Simply Smart Wealth",
};

export default function NotFound() {
  return (
    <>
${notFoundContent}

\t\t\t<Behaviors />
\t\t\t<Footer variant="default" />
    </>
  );
}
`
);
console.log("wrote app/not-found.tsx");
