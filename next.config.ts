import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  outputFileTracingRoot: process.cwd(),
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...(config.watchOptions ?? {}),
        ignored: [
          "**/node_modules/**",
          "**/.next/**",
          "**/public/assets/**",
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
