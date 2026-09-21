import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/**
 * Repairs NEXTAUTH_URL before any bundling or prerendering happens.
 *
 * `next-auth/react` parses NEXTAUTH_URL at module scope with `new URL(...)`,
 * and its `??` fallback only triggers on null/undefined. A value that is set
 * but empty ("") therefore throws "TypeError: Invalid URL ... code:
 * ERR_INVALID_URL" and fails the production build while prerendering pages
 * that import the auth client. Unsetting a blank or malformed value lets
 * NextAuth fall back to VERCEL_URL (or its localhost default) instead of
 * crashing the build.
 */
function normalizeNextAuthUrl(): void {
  const raw = process.env.NEXTAUTH_URL;
  if (raw === undefined) return; // Safe: NextAuth falls back to VERCEL_URL.
  const trimmed = raw.trim();
  if (!trimmed) {
    delete process.env.NEXTAUTH_URL;
    return;
  }
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    process.env.NEXTAUTH_URL =
      url.pathname === "/" ? url.origin : `${url.origin}${url.pathname}`;
  } catch {
    delete process.env.NEXTAUTH_URL;
  }
}

normalizeNextAuthUrl();

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * Build output directory. Vercel's Next.js builder always collects `.next`,
 * so a custom directory must never be used there. Locally, production builds
 * go to `.next-production` so they cannot clobber a running `next dev`.
 * NEXT_DIST_DIR overrides both. `resolveDistDir` is mirrored in
 * `scripts/verify-production.mjs`; keep the two in sync.
 */
function resolveDistDir(phase: string): string {
  if (process.env.NEXT_DIST_DIR) return process.env.NEXT_DIST_DIR;
  if (process.env.VERCEL) return ".next";
  return phase === PHASE_DEVELOPMENT_SERVER ? ".next" : ".next-production";
}

export default function nextConfig(phase: string): NextConfig {
  return {
    experimental: { serverActions: { bodySizeLimit: "5mb" } },
    distDir: resolveDistDir(phase),
    // Legacy template demo URLs redirect to their real equivalents so no
    // old link lands on a dead page.
    async redirects() {
      return [
        { source: "/home-2", destination: "/", permanent: true },
        { source: "/home-3", destination: "/", permanent: true },
        { source: "/single", destination: "/", permanent: true },
        { source: "/single-2", destination: "/", permanent: true },
        { source: "/single-3", destination: "/", permanent: true },
        { source: "/single-4", destination: "/", permanent: true },
        { source: "/author", destination: "/", permanent: true },
        { source: "/typography", destination: "/", permanent: true },
        { source: "/category-list", destination: "/category", permanent: true },
        { source: "/category-grid", destination: "/category", permanent: true },
        { source: "/category-masonry", destination: "/category", permanent: true },
        { source: "/category-big", destination: "/category", permanent: true },
        { source: "/categories", destination: "/category", permanent: true },
        { source: "/categories/:slug", destination: "/category/:slug", permanent: true },
      ];
    },
    async headers() {
      return [
        {
          source: "/:path*",
          headers:
            process.env.NODE_ENV === "production"
              ? [...securityHeaders, { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
              : securityHeaders,
        },
      ];
    },
  };
}

