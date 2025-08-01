/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dynamic deployment for Netlify with API routes
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['ugc.same-assets.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    forceSwcTransforms: true,
  },
  staticPageGenerationTimeout: 60,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Ensure API routes are excluded from static generation
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Skip static optimization for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
