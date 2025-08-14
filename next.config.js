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
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
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
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
    
    // Enhanced chunk optimization for better caching and performance
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 200000,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            priority: 10,
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
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
            priority: 35,
            enforce: true,
          },
          motion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'motion',
            chunks: 'all',
            priority: 30,
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