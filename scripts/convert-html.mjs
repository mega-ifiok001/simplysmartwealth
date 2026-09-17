// Converts the mirrored HTML template into JSX fragments for the Next.js app.
// Run: node scripts/convert-html.mjs
//
// Outputs (in tmp/generated/):
//   blocks/<name>.jsx      - shared blocks (header, footer, offcanvas, search, site-bottom)
//   pages/<route>.jsx      - per-page main content JSX
import * as fs from "node:fs";
import * as path from "node:path";
import * as cheerio from "cheerio";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "tmp", "generated");

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "blocks"), { recursive: true });
fs.mkdirSync(path.join(OUT, "pages"), { recursive: true });

// ---------------------------------------------------------------- config ---

export const ROUTES = {
  "index.html": "/",
  "home-2.html": "/home-2",
  "home-3.html": "/home-3",
  "category.html": "/category",
  "category-big.html": "/category-big",
  "category-grid.html": "/category-grid",
  "category-list.html": "/category-list",
  "category-masonry.html": "/category-masonry",
  "single.html": "/single",
  "single-2.html": "/single-2",
  "single-3.html": "/single-3",
  "single-4.html": "/single-4",
  "page-about.html": "/about",
  "page-contact.html": "/contact",
  "page-login.html": "/login",
  "page-register.html": "/register",
  "page-search.html": "/search",
  "page-typography.html": "/typography",
  "page-author.html": "/author",
  "page-404.html": "/404",
};

function routeFor(href) {
  if (!href) return null;
  const m = href.match(/^([a-z0-9-]+\.html)(#[^?]*)?(\?.*)?$/i);
  if (!m) return null;
  const base = ROUTES[m[1]];
  if (!base) return null;
  return base + (m[2] || "") + (m[3] || "");
}

// -------------------------------------------------------- serialization ---

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
  "meta", "param", "source", "track", "wbr",
]);

const ATTR_RENAMES = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  colspan: "colSpan",
  rowspan: "rowSpan",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  contenteditable: "contentEditable",
  spellcheck: "spellCheck",
  srcset: "srcSet",
  datetime: "dateTime",
  novalidate: "noValidate",
  enctype: "encType",
  crossorigin: "crossOrigin",
  usemap: "useMap",
  frameborder: "frameBorder",
  accesskey: "accessKey",
  allowfullscreen: "allowFullScreen",
  playsinline: "playsInline",
  referrerpolicy: "referrerPolicy",
  formaction: "formAction",
  formmethod: "formMethod",
  acceptcharset: "acceptCharset",
  itemscope: "itemScope",
  itemid: "itemID",
  itemprop: "itemProp",
  itemref: "itemRef",
  itemtype: "itemType",
};

const BOOL_ATTRS = new Set([
  "required", "checked", "selected", "disabled", "readOnly", "multiple",
  "autoFocus", "noValidate", "autoPlay", "loop", "muted", "open", "controls", "itemScope",
  "reversed", "nowrap", "ismap", "defer", "async",
]);

// attributes that must be numeric in JSX (React types demand numbers)
const NUMERIC_ATTRS = new Set(["cols", "rows", "span", "size", "width", "height", "tabIndex", "start"]);

function camelCssProp(prop) {
  return prop.trim().replace(/^-ms-/, "ms-").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function styleStringToJsx(styleStr) {
  const decls = styleStr.split(";").map((d) => d.trim()).filter(Boolean);
  const parts = decls.map((decl) => {
    const idx = decl.indexOf(":");
    const prop = decl.slice(0, idx);
    let value = decl.slice(idx + 1).trim();
    // rewrite relative asset paths to public-root paths
    value = value.replace(/url\((['"]?)assets\//g, "url($1/assets/");
    return `${camelCssProp(prop)}: "${value.replace(/"/g, '\\"')}"`;
  });
  return `{{ ${parts.join(", ")} }}`;
}

function chooseQuote(value) {
  if (value.includes('"') && !value.includes("'")) return "'";
  return '"';
}

function escapeAttrValue(value, quote) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(new RegExp(quote, "g"), quote === '"' ? "&quot;" : "&#39;");
}

function formatAttr(name, value) {
  const renamed = ATTR_RENAMES[name] || name;

  if (name === "style") return `style=${styleStringToJsx(value)}`;

  // route + asset rewriting
  if (name === "href" || name === "src") {
    let v = value;
    if (name === "src") {
      v = v.replace(/^assets\//, "/assets/");
    } else {
      const route = routeFor(v);
      if (route !== null) v = route;
    }
    const q = chooseQuote(v);
    return `${renamed}=${q}${escapeAttrValue(v, q)}${q}`;
  }

  // boolean attributes render bare
  if (BOOL_ATTRS.has(renamed) && (value === "" || value === name.toLowerCase())) {
    return renamed;
  }

  // numeric attributes render as JSX expressions
  if (NUMERIC_ATTRS.has(renamed) && /^\d+$/.test(value)) {
    return `${renamed}={${value}}`;
  }

  const q = chooseQuote(value);
  return `${renamed}=${q}${escapeAttrValue(value, q)}${q}`;
}

function escapeText(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

const indent = (n) => "\t".repeat(n);

const INLINE_TAGS = new Set([
  "a", "abbr", "b", "bdi", "bdo", "br", "button", "cite", "code", "data",
  "dfn", "em", "i", "img", "input", "kbd", "label", "map", "mark", "meter",
  "object", "output", "picture", "progress", "q", "ruby", "s", "samp",
  "select", "small", "span", "strong", "sub", "sup", "svg", "template",
  "textarea", "time", "u", "var", "wbr", "ul", "li", "option", "optgroup",
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "td", "th", "tr", "label", "form",
]);

function serializeNode(node, depth, out) {
  if (node.type === "text") {
    let text = node.data.replace(/\s+/g, " ");
    if (text.trim() === "") {
      if (text === " ") out.push(" ");
      return;
    }
    out.push(escapeText(text));
    return;
  }
  if (node.type !== "tag") return; // skip comments, scripts, directives

  const tag = node.tagName;
  const attrs = Object.entries(node.attribs || {})
    .map(([name, value]) => ` ${formatAttr(name, value ?? name)}`)
    .join("");

  const children = (node.children || []);

  if (VOID.has(tag)) {
    out.push(`<${tag}${attrs} />`);
    return;
  }
  if (children.length === 0) {
    out.push(`<${tag}${attrs}></${tag}>`);
    return;
  }

  const hasBlockChild = children.some(
    (c) => c.type === "tag" && !INLINE_TAGS.has(c.tagName)
  );

  if (!hasBlockChild) {
    const inner = [];
    for (const c of children) serializeNode(c, 0, inner);
    out.push(`<${tag}${attrs}>${inner.join("").trim()}</${tag}>`);
    return;
  }

  // Block layout: open tag, children on new lines, close tag.
  out.push(`<${tag}${attrs}>`);
  for (const c of children) {
    const buf = [];
    serializeNode(c, depth + 1, buf);
    const rendered = buf.join("");
    if (rendered.trim() === "") continue;
    out.push(`\n${indent(depth + 1)}${rendered.trim()}`);
  }
  out.push(`\n${indent(depth)}</${tag}>`);
}

// ----------------------------------------------------------- conversion ---

export function convertToJsx(htmlFragment) {
  const $ = cheerio.load(htmlFragment, { decodeEntities: false }, false);
  const root = $.root()[0];
  const out = [];
  for (const node of root.children || []) serializeNode(node, 0, out);
  return out.join("");
}

// ---------------------------------------------------------- extraction ---

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

function cleanFragment(fragment) {
  // strip leftover HTML comments (they'd become JSX comments, which is noisy)
  return fragment.replace(/<!--[\s\S]*?-->/g, "");
}

const pages = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith(".html"))
  .sort();

for (const page of pages) {
  const html = fs.readFileSync(path.join(ROOT, page), "utf8");
  const route = ROUTES[page];

  for (const [name, markers] of Object.entries(MARKERS)) {
    const fragment = cut(html, markers);
    if (!fragment) continue;
    const jsx = convertToJsx(cleanFragment(fragment));
    if (name === "mainContent") {
      const file = route === "/" ? "__home" : route.replace(/^\//, "").replace(/\//g, "_");
      fs.writeFileSync(path.join(OUT, "pages", `${file}.jsx`), jsx + "\n");
    } else {
      // only write shared blocks once (verified identical across pages)
      const dest = path.join(OUT, "blocks", `${name}.jsx`);
      if (!fs.existsSync(dest)) {
        fs.writeFileSync(dest, `<!-- source: ${page} -->\n` + jsx + "\n");
      }
    }
  }
  console.log(`converted ${page} -> ${route}`);
}
console.log("done ->", OUT);

