const API_ROOT_URL = process.env.API_ROOT_URL

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${API_ROOT_URL}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
