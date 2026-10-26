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
    ];
  },
};

export default nextConfig;
