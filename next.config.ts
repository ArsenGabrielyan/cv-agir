import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
  async headers() {
      return [
        {
          source: "/api/(.*)",
          headers: [
            { key: "Access-Control-Allow-Origin", value: "*" },
            { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
            { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
            { key: "Content-Range", value: "bytes : 0-9/*" },
          ],
        },
        {
          source: "/(.*)",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "X-Frame-Options", value: "DENY" },
            { key: "X-XSS-Protection", value: "1; mode=block" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            {
              key: "Content-Security-Policy",
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline'",
                "style-src 'self' 'unsafe-inline'",
                "img-src * blob: data:",
                "font-src 'self' data:",
                "object-src 'none'",
                "frame-ancestors 'none'",
              ].join("; "),
            },
          ],
        },
      ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nlufwtlc3xvedi7i.public.blob.vercel-storage.com"
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb"
    },
  },
};

export default nextConfig;