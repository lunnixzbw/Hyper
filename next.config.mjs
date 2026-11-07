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
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
    ],
  },
};

export default nextConfig;
