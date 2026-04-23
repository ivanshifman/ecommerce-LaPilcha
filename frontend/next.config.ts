import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  headers: async () => [
    {
      source: '/(profile|orders)(.*)',
      headers: [
        { key: 'Cache-Control', value: 'no-store, max-age=0' },
      ],
    },
  ],
};

export default nextConfig;