import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true
});

export const config = {
  matcher: [
    // 匹配根路径
    '/',
    // 匹配所有语言前缀的路径
    '/(zh-CN|en|ja)/:path*',
    // 排除Next.js内部路径、API路由、静态文件等
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ],
}; 