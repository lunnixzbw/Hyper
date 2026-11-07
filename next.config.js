/** @type {import('next').NextConfig} */
const nextConfig = {
  // hyperbot.bond/support goes straight to the support server.
  async redirects() {
    const support = process.env.NEXT_PUBLIC_SUPPORT_URL || '/contact'
    return [
      { source: '/support', destination: support, permanent: false },
      { source: '/discord', destination: support, permanent: false },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
    ],
  },
  webpack: (config) => {
    config.cache = false
    return config
  }
}

module.exports = nextConfig