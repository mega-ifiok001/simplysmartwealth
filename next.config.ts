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

