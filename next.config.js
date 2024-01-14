/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  redirects: async () => [
    {
      source: '/',
      destination: '/home',
      permanent: true,
    },
  ]
};

module.exports = nextConfig;
