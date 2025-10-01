import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
