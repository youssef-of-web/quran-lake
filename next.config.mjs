import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from 'next-pwa';
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

const withPwa = withPWA({
  dest: 'public',
});

export default withPwa(withNextIntl(nextConfig));
