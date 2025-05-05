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
  images: {
    domains: [
      // Extract hostname from NEXT_PUBLIC_SUPABASE_URL environment variable
      new URL(
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
          "https://yxbodcbgsphwmsdrjtlm.supabase.co"
      ).hostname,
    ],
  },
};

module.exports = nextConfig;
