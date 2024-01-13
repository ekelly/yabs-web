/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  redirects: async () => [
    {
      source: '/',
      destination: '/home',
      permanent: true,
    },
  ]
};

module.exports = nextConfig;
