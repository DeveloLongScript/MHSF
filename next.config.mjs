import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/docs',
        destination: '/docs/getting-started',
        permanent: true,
      },
    ]
  },
};

export default withContentlayer(nextConfig);
