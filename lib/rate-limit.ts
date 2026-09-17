import { prisma } from "@/lib/db";

/**
 * Atomic fixed-window limiter backed by PostgreSQL so the limit is shared
 * across application instances. Returns true when the caller is over budget.
 */
export async function overLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const now = new Date();
  const expires = new Date(now.getTime() + windowMs);
  const rows = await prisma.$queryRaw<Array<{ count: number }>>`
    INSERT INTO "SubmissionAttempt" ("key", "count", "expiresAt")
    VALUES (${key}, 1, ${expires})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "SubmissionAttempt"."expiresAt" < ${now} THEN 1 ELSE "SubmissionAttempt"."count" + 1 END,
      "expiresAt" = CASE WHEN "SubmissionAttempt"."expiresAt" < ${now} THEN ${expires} ELSE "SubmissionAttempt"."expiresAt" END
    RETURNING "count"`;
  return rows[0].count > limit;
}
