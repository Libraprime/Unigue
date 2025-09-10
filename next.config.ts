// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Example for a static host
      {
        protocol: 'https',
        hostname: 'cdn-icons-mp4.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-gif.flaticon.com',
      },
      // Your Firebase Storage Bucket hostname
      {
        protocol: 'https',
        hostname: 'unique-736db.firebasestorage.app',
      },
    ],
  },
};

export default nextConfig;