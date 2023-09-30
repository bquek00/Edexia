/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    async headers() {
      return [
        {
          source: '/api/test',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, max-age=0, must-revalidate',
            },
          ],
        },
      ]
    },
  }
