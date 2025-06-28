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
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "coex.global",
      },
      {
        protocol: "https",
        hostname: "assets.revolut.com",
      },
      {
        protocol: "https",
        hostname: "www.revolut.com",
      },
      {
        protocol: "https",
        hostname: "res.coinpaper.com",
      }
    ],
  },
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    scrollRestoration: true
  },
  // Оптимизация для производительности
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Оптимизация изображений
  optimizeFonts: true
};

module.exports = nextConfig;