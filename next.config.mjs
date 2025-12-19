// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  // Disable static page generation for dynamic routes
  output: 'standalone',
};

export default nextConfig;