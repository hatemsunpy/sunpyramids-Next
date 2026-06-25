import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel's image optimization is disabled because the current plan
    // returns 402 Payment Required for external media. Serve images directly
    // from the configured remote hosts (sunpyramidtours.com, R2, etc.).
    unoptimized: true,
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
