/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // این خط برای تطابق با تمام مسیرهای URL است
      },
    ],
  },
}

module.exports = nextConfig
