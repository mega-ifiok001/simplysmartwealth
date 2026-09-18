/**
 * Resolves the client IP for rate limiting.
 *
 * Spoofing note: `x-forwarded-for` is client-controlled unless every hop in
 * front of the app overwrites it. Only trust it when the operator has
 * confirmed the deployment topology via TRUST_PROXY=true. When untrusted,
 * this returns null and callers fall back to shared (global) buckets so
 * limits still apply.
 */
export function getClientIp(
  headers: Headers,
  { trustProxy }: { trustProxy: boolean },
): string | null {
  if (!trustProxy) return null;
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || null;
}

/** Every untrusted (null-IP) caller shares this bucket name. */
export const UNKNOWN_IP_BUCKET = "unknown";