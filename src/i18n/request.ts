import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // 验证locale参数
  if (!locale || !locales.includes(locale as Locale)) {
    // 在Next.js 15中，如果locale无效，我们需要使用notFound或重定向
    if (locale && !locales.includes(locale as Locale)) {
      notFound();
    }
  }
  
  const validLocale: Locale = locale && locales.includes(locale as Locale) 
    ? (locale as Locale) 
    : defaultLocale;

  try {
    const messages = {
      // Load all language files and maintain their nested structure
      ...(await import(`./locales/${validLocale}/common.json`)).default,
      auth: (await import(`./locales/${validLocale}/auth.json`)).default,
      navigation: (await import(`./locales/${validLocale}/navigation.json`)).default,
      dashboard: (await import(`./locales/${validLocale}/dashboard.json`)).default,
      help: (await import(`./locales/${validLocale}/help.json`)).default,
      'style-profiles': (await import(`./locales/${validLocale}/style-profiles.json`)).default,
      merchandise: (await import(`./locales/${validLocale}/merchandise.json`)).default,
      outlines: (await import(`./locales/${validLocale}/outlines.json`)).default,
      articles: (await import(`./locales/${validLocale}/articles.json`)).default,
      flowchart: (await import(`./locales/${validLocale}/flowchart.json`)).default,
      publishing: (await import(`./locales/${validLocale}/publishing.json`)).default,
      settings: (await import(`./locales/${validLocale}/settings.json`)).default,
      queue: (await import(`./locales/${validLocale}/queue.json`)).default,
    };

    return {
      locale: validLocale,
      messages,
      timeZone: 'Asia/Tokyo'
    };
  } catch (error) {
    console.error('Error loading i18n messages:', error);
    throw error;
  }
}); 