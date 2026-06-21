import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sunpyramidtours.com",
      },
      {
        protocol: "https",
        hostname: "sunpyramidstours.com",
      },
      {
        protocol: "https",
        hostname: "new-sunpyramids-demo.vercel.app",
      },
    ],
  },
};

export default nextConfig;
