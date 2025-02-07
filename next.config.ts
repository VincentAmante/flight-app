import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'logos.skyscnr.com'
      },
    ]
  }
};

export default nextConfig;