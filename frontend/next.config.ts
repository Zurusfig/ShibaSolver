import type { NextConfig } from "next";

// When set, API calls go through this app's own origin and are forwarded to
// the backend, so the session cookie is first-party instead of cross-site.
const apiProxyTarget = process.env.API_PROXY_TARGET;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!apiProxyTarget) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiProxyTarget}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
