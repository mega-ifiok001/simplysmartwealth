import test from "node:test";
import assert from "node:assert/strict";
import {
  validateReaderPassword,
  validateReaderName,
  validateReaderRegister,
  validateReaderSignIn,
  validateReaderCredentials,
} from "../lib/validation.ts";

function form(fields) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

test("reader passwords enforce length, byte limit, and complexity", () => {
  assert.throws(() => validateReaderPassword("short"), /at least 12/);
  assert.throws(() => validateReaderPassword("x".repeat(80)), /too long/);
  assert.throws(
    () => validateReaderPassword("alllowercase123456"),
    /number, an uppercase/,
  );
  // Exactly 72 UTF-8 bytes with upper/lower/digit is allowed; 73 is not.
  const border = "A1" + "a".repeat(70); // 72 bytes
  assert.equal(validateReaderPassword(border), border);
  assert.throws(() => validateReaderPassword("A1" + "a".repeat(71)), /too long/);
});

test("reader names are trimmed and bounded", () => {
  assert.throws(() => validateReaderName("a"), /2/);
  assert.throws(() => validateReaderName(" ".repeat(61)), /60/);
  assert.equal(validateReaderName("  Jane Doe  "), "Jane Doe");
});

test("reader registration validates fields and requires matching confirmation", () => {
  const password = "Correct horse battery 42";
  const ok = validateReaderRegister(
    form({ name: "Jane Doe", email: "jane@example.com", password, password_confirm: password }),
  );
  assert.equal(ok.email, "jane@example.com");
  assert.equal(ok.name, "Jane Doe");
  assert.equal(ok.password, password);
  assert.throws(
    () =>
      validateReaderRegister(
        form({ name: "Jane Doe", email: "jane@example.com", password, password_confirm: "different" }),
      ),
    /do not match/i,
  );
  assert.throws(
    () => validateReaderRegister(form({ name: "Jane Doe", email: "not-an-email", password, password_confirm: password })),
    /email/i,
  );
  assert.throws(
    () => validateReaderRegister(form({ name: "Jane Doe", email: "jane@example.com", password: "short", password_confirm: "short" })),
  );
});

test("reader sign-in normalizes the email and requires a password", () => {
  const parsed = validateReaderSignIn(form({ email: "  Jane@Example.COM ", password: "whatever" }));
  assert.equal(parsed.email, "jane@example.com");
  assert.equal(parsed.password, "whatever");
  assert.throws(() => validateReaderSignIn(form({ email: "", password: "whatever" })));
  assert.throws(() => validateReaderSignIn(form({ email: "jane@example.com", password: "" })));
});

test("reader credentials variant accepts strings and rejects junk", () => {
  const parsed = validateReaderCredentials(" Jane@Example.COM ", "whatever");
  assert.equal(parsed.email, "jane@example.com");
  assert.throws(() => validateReaderCredentials(undefined, "whatever"));
  assert.throws(() => validateReaderCredentials("jane@example.com", null));
});
