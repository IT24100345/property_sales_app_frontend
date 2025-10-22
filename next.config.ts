import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{
      protocol: 'http',
      hostname: 'localhost',
      port: '8080',
      pathname: "/api/images/**"
    },
    {
      protocol: 'https',
      hostname: 'ui-avatars.com',
      pathname: "/api/**"
    }]
  }
};

export default nextConfig;
