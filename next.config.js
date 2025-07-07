/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.brandfetch.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "coex.global",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.revolut.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.revolut.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.coinpaper.com",
        pathname: "/**",
      }
    ],
  },
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, '.'),
    };
    return config;
  },
};

module.exports = nextConfig;