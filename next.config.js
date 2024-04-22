/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/protected",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
