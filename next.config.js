/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
// next.config.js
/** @type {import('next').NextConfig} */

function getWebpackSafe() {
  try {
    // обычный webpack в Node-окружении
    return require('webpack');
  } catch {}
  try {
    // бандленый webpack, который использует сам Next.js
    return require('next/dist/compiled/webpack/webpack');
  } catch {}
  return null;
}

const nextConfig = {
  reactStrictMode: true,

  // если у тебя есть другие опции — оставь их
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
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
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  webpack: (config, { isServer }) => {
    const wp = getWebpackSafe();

    // Fix for Supabase realtime-js critical dependency warning
    config.module.exprContextCritical = false;

    // Use IgnorePlugin to completely prevent react-fast-marquee from being processed on server
    if (isServer && wp && wp.IgnorePlugin) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        new wp.IgnorePlugin({ resourceRegExp: /^react-fast-marquee$/ })
      );
    } else if (isServer) {
      console.warn('[next.config] webpack.IgnorePlugin not available; skipping react-fast-marquee ignore for server build');
    }

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
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };

    return config;
  },
};

module.exports = nextConfig;