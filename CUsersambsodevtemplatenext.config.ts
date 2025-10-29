import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configure the project root to point to the app directory
  experimental: {
    rootDir: './next-sqlite-starter',
  },
};

export default nextConfig;
