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
  // The allowedDevOrigins property must be inside the main config object
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    'http://10.137.0.62:3000' // Make sure to include the protocol and port if your request is coming from there
  ],
};

export default nextConfig;
