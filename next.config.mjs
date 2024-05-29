import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
			use: [{ loader: "@svgr/webpack", options: { icon: true } }],
    });
    return config;
  }
};

export default withNextIntl(nextConfig);
