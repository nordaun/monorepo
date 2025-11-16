import config from "@repo/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  devIndicators: false,
  experimental: {
    typedEnv: true,
    serverActions: {
      allowedOrigins: config.urls.origins,
    },
  },
  allowedDevOrigins: config.urls.origins,
  images: { remotePatterns: [new URL(`${config.urls.cdn}/**`)] },
};

export default nextConfig;
