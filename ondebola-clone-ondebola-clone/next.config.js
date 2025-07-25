/**
 * @type {import('next').NextConfig}
 *
 * Basic Next.js configuration. We enable React strict mode to catch
 * potential problems. Additional configuration options can be added
 * here if needed in the future.
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: true
  }
};

module.exports = nextConfig;
