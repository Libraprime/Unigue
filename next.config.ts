/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn-icons-mp4.flaticon.com' },
      { protocol: 'https', hostname: 'cdn-icons-gif.flaticon.com' },
      { protocol: 'https', hostname: 'unique-736db.firebasestorage.app' },
    ],
  },
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    'http://10.137.0.62:3000',
    'http://10.104.68.43:3000', // 👈 add your actual dev IP
  ],
};

export default nextConfig;
