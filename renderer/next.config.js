/** @type {import('next').NextConfig} */
module.exports = {
  // Comment out or remove the output export setting
  // output: 'export',

  distDir: process.env.NODE_ENV === 'production' ? '../app' : '.next',
  trailingSlash: true,

  // exportTrailingSlash: true,
  
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  },
}
