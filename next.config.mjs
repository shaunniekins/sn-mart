/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/panel",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
