// next.config.js
/** @type {import('next').NextConfig} */
const path = require('path');

function getWebpackSafe() {
  try {
    return require('webpack'); // локальный webpack
  } catch {}
  try {
    return require('next/dist/compiled/webpack/webpack'); // бандленный webpack Next.js
  } catch {}
  return null;
}

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.brandfetch.io', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'coex.global', pathname: '/**' },
      { protocol: 'https', hostname: 'assets.revolut.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.revolut.com', pathname: '/**' },
      { protocol: 'https', hostname: 'assets.coingecko.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.coinpaper.com', pathname: '/**' },
      { protocol: 'https', hostname: 'coin-images.coingecko.com', pathname: '/**' },
    ],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  webpack: (config, { isServer }) => {
    const wp = getWebpackSafe();

    config.module = config.module || {};
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.optimization = config.optimization || {};
    if (!config.plugins) config.plugins = [];

    config.module.exprContextCritical = false;

    if (isServer && wp && wp.IgnorePlugin) {
      config.plugins.push(new wp.IgnorePlugin({ resourceRegExp: /^react-fast-marquee$/ }));
    } else if (isServer && (!wp || !wp.IgnorePlugin)) {
      console.warn('[next.config] IgnorePlugin недоступен; пропускаем игнор react-fast-marquee для server build');
    }

    config.resolve.alias['@'] = path.resolve(__dirname, '.');

    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        net: false,
        tls: false,
      };
    }

    config.optimization.splitChunks = {
      ...(config.optimization.splitChunks || {}),
      chunks: 'all',
      cacheGroups: {
        ...(config.optimization.splitChunks?.cacheGroups || {}),
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
    };

    return config;
  },
};

module.exports = nextConfig;
