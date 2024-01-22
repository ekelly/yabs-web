const withPWA = require('next-pwa')({
  dest: 'public',
  cacheStartUrl: true,
  cacheOnFrontEndNav: true,
  reloadOnOnline: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
};

module.exports = withPWA(nextConfig);
