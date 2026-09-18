import { createHash, randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";

export type TokenPurpose =
  | "VERIFY_EMAIL"
  | "PASSWORD_RESET"
  | "NEWSLETTER_CONFIRM"
  | "NEWSLETTER_UNSUB";

/**
 * Issues a single-use auth token. Only the bcrypt hash is stored, so a
 * database leak cannot be used to act on outstanding tokens. The raw token
 * is returned once for embedding in an email link.
 */
export async function issueToken(
  email: string,
  purpose: TokenPurpose,
  ttlMs = 24 * 60 * 60 * 1000,
): Promise<string> {
  const raw = createHash("sha256")
    .update(randomUUID() + email + process.env.NEXTAUTH_SECRET)
    .digest("hex")
    .slice(0, 32);
  await prisma.authToken.create({
    data: {
      email,
      tokenHash: await hash(raw, 10),
      purpose,
      expiresAt: new Date(Date.now() + ttlMs),
    },
  });
  return raw;
}

/** Validates and burns a token; null when missing, expired, or already used. */
export async function consumeToken(
  raw: string,
  purpose: TokenPurpose,
): Promise<{ id: string; email: string } | null> {
  if (!raw || raw.length > 128) return null;
  const tokenHash = await hash(raw, 10);
  const record = await prisma.authToken.findFirst({
    where: {
      tokenHash,
      purpose,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!record) return null;
  await prisma.authToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });
  return { id: record.id, email: record.email };
}