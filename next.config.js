const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    NEXT_PUBLIC_DIFY_FLOW8_APP_TOKEN: process.env.NEXT_PUBLIC_DIFY_FLOW8_APP_TOKEN,
    NEXT_PUBLIC_DIFY_FLOW9_APP_TOKEN: process.env.NEXT_PUBLIC_DIFY_FLOW9_APP_TOKEN,
    NEXT_PUBLIC_DIFY_FLOW10_APP_TOKEN: process.env.NEXT_PUBLIC_DIFY_FLOW10_APP_TOKEN,
    NEXT_PUBLIC_DIFY_FLOW11_APP_TOKEN: process.env.NEXT_PUBLIC_DIFY_FLOW11_APP_TOKEN,
    NEXT_PUBLIC_DIFY_FILE_UPLOAD_TOKEN: process.env.NEXT_PUBLIC_DIFY_FILE_UPLOAD_TOKEN,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ptminder.ptengine.com',
      },
      // ... any other existing remotePatterns ...
    ],
    // domains: ['your-other-domain.com'], // If you were using the older 'domains' configuration
  },
};

module.exports = withNextIntl(nextConfig); 