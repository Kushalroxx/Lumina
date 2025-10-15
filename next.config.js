/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['pdf2json'],
}

module.exports = nextConfig