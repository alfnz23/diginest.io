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
};

module.exports = nextConfig;
