/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['puppeteer'],
  allowedDevOrigins: ['*.replit.dev', '*.replit.app'],
};

export default nextConfig;
