import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

export default function nextConfig(phase: string): NextConfig {
  return {
    experimental: { serverActions: { bodySizeLimit: "5mb" } },
    // Keep production builds independent of a running development server.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next" : ".next-production",
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

