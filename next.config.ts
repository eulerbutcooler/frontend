import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.NEXT_PUBLIC_MINIO_HOST || "localhost",
        port: process.env.NEXT_PUBLIC_MINIO_PORT || "9000",
      },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
  async rewrites() {
    return [
      {
        source: "/landing",
        destination: "/supermemory.html",
      },
      {
        // Keep browser API calls same-origin so the app works behind the
        // public tunnel without CORS or mixed-content failures.
        source: "/api/v1/:path*",
        destination: `${(
          process.env.API_URL || "http://localhost:8080"
        ).replace(/\/+$/, "")}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
