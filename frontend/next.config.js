/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  async rewrites() {
    // On production the api gateway will take care of this
    if (process.env.NODE_ENV !== 'production') {
      return [
        {
          source: '/api/v1/:path*',
          destination: `http://localhost:8080/:path*`,
        },
      ]
    }

    return []
  },
}

module.exports = nextConfig
