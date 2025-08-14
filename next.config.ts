import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable reactStrictMode to avoid double-invocation of effects in dev
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "exuberant-comfort-0c2f94bc2b.strapiapp.com",
      },
    ],
  },
};

export default nextConfig;
