import MangleCssClassPlugin from "mangle-css-class-webpack-plugin";

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
  webpack: (config, { dev }) => {
    config.resolve.modules.push(path.resolve("./"));

    if (!dev) {
      config.plugins.push(
        new MangleCssClassPlugin({
          classNameRegExp:
            "(([a-zA-Z-:]*)[\\\\\\\\]*:)*([\\\\\\\\]*!)?tw-[a-zA-Z-]([a-zA-Z0-9-]*([\\\\\\\\]*(\\%|\\#|\\.|\\[|\\]))*)*",
          //  ignorePrefixRegExp: "((hover|focus|active|disabled|visited|first|last|odd|even|group-hover|focus-within|xs|sm|md||lg|xl)(\\\\\\\\\\\\\\\\|\\\\)?:)*",

          classGenerator: (original, opts, context) => {
            if (classNames[original]) {
              return classNames[original];
            }

            let nextId;

            do {
              // Class name cannot start with a number.
              nextId = `cfk-${Math.random()}`;
            } while (/^[0-9_-]/.test(nextId));

            return (classNames[original] = nextId);
          },
          //  log: true
        })
      );
    }
    return config;
  },
};

export default nextConfig;
