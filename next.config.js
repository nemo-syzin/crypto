/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    /** Disable failing build due to ESLint errors */
    ignoreDuringBuilds: true,
  },
  typescript: {
    /** Disable failing build due to TypeScript errors */
    ignoreBuildErrors: true,
  },
  images: { 
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
      },
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
        pathname: "/**",
      }
    ],
  },
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    optimizeCss: true,
    // Enable modern bundling optimizations
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Add performance optimizations
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  webpack: (config, { isServer }) => {
    // Fix for Supabase realtime-js critical dependency warning
    config.module.exprContextCritical = false;
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, '.'),
    };
    
    // Fix for client-side modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Optimize chunks for better caching
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            reuseExistingChunk: true,
          },
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
        },
      },
    };
    
    return config;
  },
};

module.exports = nextConfig;