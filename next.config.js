/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: '*.clerk.accounts.dev',
      },
    ],
  },
  // Ensure API routes are not statically analyzed during build
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Disable static optimization for API routes during build
  output: undefined, // Let Amplify handle the output
};

export default nextConfig;
