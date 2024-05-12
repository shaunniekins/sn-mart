/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/authuser",
        destination: "/authuser/admin/dashboard",
        permanent: false,
      },
      {
        source: "/",
        destination: "/home",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
