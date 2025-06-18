/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dynamic deployment only - no static generation
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
  // Disable static optimization completely
  staticPageGenerationTimeout: 60,
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

module.exports = nextConfig;
