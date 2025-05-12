import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from 'next-pwa';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

export default withPWA({
  dest: 'public', // destination directory for the PWA files
  register: true, // register the PWA service worker
  skipWaiting: true, // skip waiting for service worker activation
})(withNextIntl(nextConfig));
