'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale, defaultLocale } from '@/i18n/config';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const tCommon = useTranslations('common');

  // 直接从pathname解析当前语言，确保实时更新
  const currentLocale = useMemo((): Locale => {
    const pathSegments = pathname.split('/');
    const pathLocale = pathSegments[1];
    
    // 检查路径中的语言是否是有效的locale
    if (pathLocale && locales.includes(pathLocale as Locale)) {
      return pathLocale as Locale;
    }
    
    return defaultLocale;
  }, [pathname]);

  // Language switching handler
  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    
    // Replace the current locale in the pathname with the new one
    const segments = pathname.split('/');
    segments[1] = newLocale; // Replace the locale segment
    const newPathname = segments.join('/');
    
    // Use window.location for immediate navigation and refresh
    window.location.href = newPathname;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
          <Languages className="h-4 w-4" />
          <span className="sr-only">{tCommon('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`cursor-pointer flex items-center justify-between ${
              loc === currentLocale ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <div className="flex items-center">
              <span className="mr-3 text-base">{localeFlags[loc]}</span>
              <span>{localeNames[loc]}</span>
            </div>
            {loc === currentLocale && (
              <span className="ml-2 text-xs text-blue-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 