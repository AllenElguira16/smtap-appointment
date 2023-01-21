/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/sign-in",
        permanent: true,
      },
      {
        source: "/user",
        destination: "/user/appointment",
        permanent: true,
      },
      {
        source: "/admin",
        destination: "/admin/users",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
