import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable transpilePackages for three.js if needed
  transpilePackages: [],
  // Optimize images
  images: {
    domains: [],
  },
  // Disable strict mode for smoother animations (optional)
  reactStrictMode: true,
};

export default nextConfig;
