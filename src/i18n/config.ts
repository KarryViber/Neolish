export type Locale = 'en' | 'zh-CN' | 'ja';

export const locales: Locale[] = ['en', 'zh-CN', 'ja'];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  'en': 'English',
  'zh-CN': '简体中文',
  'ja': '日本語',
};

export const localeFlags: Record<Locale, string> = {
  'en': '🇺🇸',
  'zh-CN': '🇨🇳',
  'ja': '🇯🇵',
}; 