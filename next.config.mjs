/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  webpack: (config) => {
    // Disable webpack disk caching to prevent OneDrive file-locking collisions on Windows
    config.cache = false;
    return config;
  }
};

export default nextConfig;
