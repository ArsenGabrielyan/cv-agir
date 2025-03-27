import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
      return [
        {
          source: "/api/(.*)",
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: "*"
            },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET, POST, PUT, DELETE, OPTIONS"
            },
            {
              key: "Access-Control-Allow-Header",
              value: "Content-Type, Authorization"
            },
            {
              key: "Content-Range",
              value: "bytes : 0-9/*"
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
      {
        protocol: "https",
        hostname: "mciqqhbxzsxpvdiekfrk.supabase.co"
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb"
    }
  }
};

export default nextConfig;
