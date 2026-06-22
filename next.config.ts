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
      {
        protocol: "https",
        hostname: "pub-5ccb6ad334fb427684d7f3fa11a34197.r2.dev",
      },
    ],
  },
};

export default nextConfig;
