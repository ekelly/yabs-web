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

// Remove spammy warning log
// https://github.com/GoogleChrome/workbox/issues/1790
module.exports = process.env.NODE_ENV === 'development' ? nextConfig : withPWA(nextConfig);
