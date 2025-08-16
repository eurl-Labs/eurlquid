import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental optimizations
  experimental: {
    optimizeCss: true,
  },
  
  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Bundle analyzer and tree shaking
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\/\\]node_modules[\/\\]/,
            name: 'vendors',
            chunks: 'all',
          },
          three: {
            test: /[\/\\]node_modules[\/\\](three|@react-three)[\/\\]/,
            name: 'three',
            chunks: 'all',
            priority: 10,
          },
          framer: {
            test: /[\/\\]node_modules[\/\\]framer-motion[\/\\]/,
            name: 'framer',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;
