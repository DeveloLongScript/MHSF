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
			{
				source: "/docs",
				destination: "/docs/getting-started",
				permanent: true,
			},
		];
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	output: "standalone",
}; //

export default nextConfig;
