import type { NextConfig } from "next";
import nextBundleAnalyzer from "@next/bundle-analyzer"

const nextConfig: NextConfig = {
  transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
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
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb"
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "handlebars/runtime": "handlebars/dist/cjs/handlebars.runtime",
      handlebars: "handlebars/dist/cjs/handlebars",
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "handlebars/runtime": "handlebars/dist/cjs/handlebars.runtime",
      handlebars: "handlebars/dist/cjs/handlebars",
    }
  }
};

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
})

export default withBundleAnalyzer(nextConfig);
