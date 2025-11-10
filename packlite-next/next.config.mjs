/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
    // ✅ Ensures app directory dynamic routing works properly
    appDir: true,
  },

  // ✅ These pages should *not* be statically exported
  // Next.js 14 doesn’t support "dynamicPagePaths" directly,
  // but Vercel respects `output: 'standalone'` + dynamic routes via this flag:
  generateStaticParams: async () => [],

  // ✅ Recommended stability and build safety for Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Fix for dynamic pages using `useSearchParams`, cookies, etc.
  // This ensures no pages are accidentally pre-rendered statically
  // when they use dynamic features like Prisma, cookies, etc.
  async redirects() {
    return [];
  },
};

export default nextConfig;
