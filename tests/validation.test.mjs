import test from "node:test";
import assert from "node:assert/strict";
import { validatePost, validateCategory, validateComment, validateContact, validCredentials, isPublished, validSlug } from "../lib/validation.ts";
function form(overrides = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ title: "My first article", slug: "my-first-article", excerpt: "A useful introduction.", content: "This is the complete article content.", status: "DRAFT", coverAlt: "", ...overrides })) if (value !== undefined) data.append(key, value);
  return data;
}
test("valid draft is parsed and trimmed", () => {
  const post = validatePost(form({ title: " My first article " }));
  assert.equal(post.title, "My first article"); assert.equal(post.status, "DRAFT");
  assert.deepEqual(post.categoryIds, []);
});
test("categories are de-duplicated and capped at five", () => {
  const data = form();
  const id = (n) => "c".repeat(24) + n; // 25 chars, cuid-like, unique per n
  for (const n of [1, 1, 2, 3, 4, 5, 6]) data.append("categoryIds", id(n));
  const post = validatePost(data);
  assert.equal(post.categoryIds.length, 5);
  assert.deepEqual(post.categoryIds, [id(1), id(2), id(3), id(4), id(5)]);
});
test("rejects malformed and oversized fields", () => {
  for (const override of [{ slug: "../private" }, { slug: "Upper-Case" }, { slug: "two--hyphens" }, { status: "ADMIN" }, { content: "short" }, { title: "x".repeat(181) }]) assert.throws(() => validatePost(form(override)));
  for (const override of [{ categoryIds: "../etc/passwd" }, { categoryIds: "x" }]) { const f = form(); f.append("categoryIds", override.categoryIds); validatePost(f); } // invalid ids are dropped, not an error
});
test("category payloads validate name, slug, and description", () => {
  const category = new FormData();
  category.set("name", " Travel Tips "); category.set("slug", "travel-tips"); category.set("description", "x".repeat(300));
  const parsed = validateCategory(category);
  assert.equal(parsed.name, "Travel Tips");
  const bad = new FormData(); bad.set("name", "T"); bad.set("slug", "ok-slug");
  assert.throws(() => validateCategory(bad));
  const badSlug = new FormData(); badSlug.set("name", "Fine name"); badSlug.set("slug", "Bad Slug");
  assert.throws(() => validateCategory(badSlug));
  assert.equal(validSlug("a"), false); assert.equal(validSlug("a".repeat(161)), false); assert.equal(validSlug("ok-slug"), true);
});
test("credentials enforce bcrypt byte limit", () => {
  assert.equal(validCredentials("admin@example.com", "long-password-123"), true);
  assert.equal(validCredentials("invalid", "long-password-123"), false);
  assert.equal(validCredentials("admin@example.com", "short"), false);
  assert.equal(validCredentials("admin@example.com", "界".repeat(25)), false);
});
test("comment payloads validate name and content", () => {
  const ok = new FormData(); ok.set("name", " Reader One "); ok.set("content", "A thoughtful comment.");
  const parsed = validateComment(ok);
  assert.equal(parsed.authorName, "Reader One");
  const short = new FormData(); short.set("name", "A"); short.set("content", "Fine content here.");
  assert.throws(() => validateComment(short));
  const long = new FormData(); long.set("name", "Reader"); long.set("content", "x".repeat(2001));
  assert.throws(() => validateComment(long));
});
test("contact payloads validate name, email, phone, and message", () => {
  const ok = new FormData(); ok.set("name", " Reader Two "); ok.set("email", " Reader@Example.COM ");
  ok.set("phone", "555-0100"); ok.set("message", "A message with enough characters.");
  const parsed = validateContact(ok);
  assert.equal(parsed.email, "reader@example.com"); assert.equal(parsed.name, "Reader Two");
  const badEmail = new FormData(); badEmail.set("name", "Reader"); badEmail.set("email", "not-an-email"); badEmail.set("message", "Long enough message.");
  assert.throws(() => validateContact(badEmail));
  const badPhone = new FormData(); badPhone.set("name", "Reader"); badPhone.set("email", "r@example.com");
  badPhone.set("phone", "x".repeat(41)); badPhone.set("message", "Long enough message.");
  assert.throws(() => validateContact(badPhone));
});
test("only published and already released posts are public", () => {
  assert.equal(isPublished({ status: "DRAFT", publishedAt: new Date(0) }), false);
  assert.equal(isPublished({ status: "PUBLISHED", publishedAt: null }), false);
  assert.equal(isPublished({ status: "PUBLISHED", publishedAt: new Date(Date.now() + 60000) }), false);
  assert.equal(isPublished({ status: "PUBLISHED", publishedAt: new Date(0) }), true);
});

