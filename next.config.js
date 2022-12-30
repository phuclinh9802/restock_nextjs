/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "financialmodelingprep.com",
        port: "",
        pathname: "/image-stock/******",
      },
    ],
  },
};

module.exports = nextConfig;
