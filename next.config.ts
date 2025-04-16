import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "ddragon.leagueoflegends.com",
      },
    ],
  },
};

export default nextConfig;
