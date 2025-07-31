'use client';

import React, { useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Palette,
  Package,
  FileText,
  Newspaper,
  Send,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Languages,
  ShoppingBag,
  Lightbulb
} from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale, defaultLocale } from '@/i18n/config';
import { Logo } from '@/components/ui/logo';

export default function Sidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const user = session?.user;
  const isLoading = status === 'loading';

  // Get translations
  const tNav = useTranslations('nav');
  const tAuth = useTranslations('auth.login');
  const tCommon = useTranslations('common');
  const tAuthActions = useTranslations('auth.actions');

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

  // 检测当前页面是否匹配导航项的函数
  const isCurrentPage = useCallback((href: string): boolean => {
    // 去除locales前缀，获取纯净的路径进行比较
    const normalizedPathname = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '');
    const normalizedHref = href.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '');
    
    // 处理根路径情况
    if (normalizedHref === '' || normalizedHref === '/dashboard') {
      return normalizedPathname === '' || normalizedPathname === '/dashboard';
    }
    
    // 特殊处理：editor页面归属于articles导航项
    if (normalizedHref === '/articles' && normalizedPathname.startsWith('/editor')) {
      return true;
    }
    
    // 特殊处理：new-article页面也归属于articles导航项
    if (normalizedHref === '/articles' && normalizedPathname.startsWith('/new-article')) {
      return true;
    }
    
    // 对于其他路径，检查当前路径是否以导航项路径开始
    // 这样可以处理子页面的情况，比如 /articles/123 会匹配 /articles
    return normalizedPathname.startsWith(normalizedHref);
  }, [pathname]);

  // Updated navigation with locale-aware hrefs and dynamic current status
  const navigation = useMemo(() => [
    { 
      name: tNav('dashboard'), 
      href: `/${currentLocale}/dashboard`, 
      current: isCurrentPage(`/${currentLocale}/dashboard`), 
      icon: <LayoutDashboard size={18} /> 
    },
    { 
      name: tNav('styleProfiles'), 
      href: `/${currentLocale}/style-profiles`, 
      current: isCurrentPage(`/${currentLocale}/style-profiles`), 
      icon: <Palette size={18} /> 
    },
    { 
      name: tNav('merchandise'), 
      href: `/${currentLocale}/merchandise`, 
      current: isCurrentPage(`/${currentLocale}/merchandise`), 
      icon: <Package size={18} /> 
    },
    { 
      name: tNav('outlines'), 
      href: `/${currentLocale}/outlines`, 
      current: isCurrentPage(`/${currentLocale}/outlines`), 
      icon: <FileText size={18} /> 
    }, 
    { 
      name: tNav('articles'), 
      href: `/${currentLocale}/articles`, 
      current: isCurrentPage(`/${currentLocale}/articles`), 
      icon: <Newspaper size={18} /> 
    },
    { 
      name: tNav('publishing'), 
      href: `/${currentLocale}/publishing`, 
      current: isCurrentPage(`/${currentLocale}/publishing`), 
      icon: <Send size={18} /> 
    },
  ], [currentLocale, tNav, isCurrentPage]);

  // Function to get initials from username or email
  const getInitials = (name?: string | null, email?: string | null): string => {
    if (name) {
      const names = name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return '??';
  };

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
    <div className="fixed inset-y-0 left-0 z-10 w-64 overflow-y-auto bg-gray-900 px-6 flex flex-col">
      {/* Product Name at Top */}
      <div className="flex h-20 shrink-0 border-b border-gray-700 py-4 -mx-15 pl-4">
        <Logo 
          size="medium" 
          href={`/${currentLocale}/dashboard`}
          priority
        />
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7 mt-6">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={[
                      item.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800',
                      'group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    ].join(' ')}
                  >
                    <span className="w-6 h-6 flex items-center justify-center" aria-hidden="true">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>

      {/* User Profile at Bottom */}
      <div className="border-t border-gray-700 pt-4 pb-6">
        {isLoading && (
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded animate-pulse mb-1"></div>
              <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        )}

        {!isLoading && !user && (
          <div className="space-y-2">
            <Button variant="ghost" asChild className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <Link href={`/${currentLocale}/login`}>
                <LogIn className="mr-2 h-4 w-4" />
                {tAuth('signInButton')}
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href={`/${currentLocale}/register`}>
                <UserPlus className="mr-2 h-4 w-4" />
                {tAuthActions('signUp')}
              </Link>
            </Button>
          </div>
        )}

        {!isLoading && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 h-auto p-3">
                <div className="flex items-center space-x-3 w-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? user.email ?? 'User Avatar'} />
                    <AvatarFallback className="bg-gray-700 text-gray-300">{getInitials(user.name, user.email)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium leading-none truncate">{user.username || user.name || user.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs leading-none text-gray-400 mt-1 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" side="right">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.username || user.name || user.email?.split('@')[0] || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Dashboard Menu Item */}
              <DropdownMenuItem className="cursor-pointer">
                <Link href={`/${currentLocale}/dashboard`} className="flex items-center w-full">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>{tNav('dashboard')}</span>
                </Link>
              </DropdownMenuItem>
              
              {/* Settings Menu Item */}
              <DropdownMenuItem className="cursor-pointer">
                <Link href={`/${currentLocale}/settings`} className="flex items-center w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{tNav('settings')}</span>
                </Link>
              </DropdownMenuItem>
              
              {/* Language Switcher Sub-menu */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <div className="flex items-center w-full">
                    <Languages className="mr-2 h-4 w-4" />
                    <span className="flex-1">{tCommon('language')}</span>
                    <span className="ml-auto text-xs">
                      {localeFlags[currentLocale]}
                    </span>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
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
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              
              <DropdownMenuSeparator />
              
              {/* Sign Out Menu Item */}
              <DropdownMenuItem 
                onClick={() => signOut({ callbackUrl: `/${currentLocale}/login` })} 
                className="cursor-pointer flex items-center w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{tAuthActions('signOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
} 