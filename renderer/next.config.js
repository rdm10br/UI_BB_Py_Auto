/** @type {import('next').NextConfig} */
module.exports = {
  // Comment out or remove the output export setting
  output: 'export',
  // output: 'standalone',

  distDir: process.env.NODE_ENV === 'production' ? '../app' : '.next',
  trailingSlash: true,
  
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  }
}