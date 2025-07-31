'use client'; // Need client component to use usePathname

import { usePathname } from 'next/navigation';
import MainLayout from './MainLayout'; // Import your existing MainLayout
import React from 'react';

// List of route patterns where the main layout (including sidebar) should NOT be shown
const noLayoutRoutes = ['/login', '/register'];

export interface LayoutWrapperProps { 
  children: React.ReactNode;
  className?: string; 
}

export default function LayoutWrapper({ children, className }: LayoutWrapperProps) { 
  const pathname = usePathname();

  // Check if the current path is one of the routes that shouldn't have the main layout
  // Support locale-prefixed paths like /en/login, /zh-CN/register, etc.
  const disableLayout = noLayoutRoutes.some(route => {
    // Check exact match first (for paths without locale prefix)
    if (pathname === route) return true;
    
    // Check if pathname ends with the route (for locale-prefixed paths)
    // This will match /en/login, /zh-CN/login, etc. with /login
    return pathname.endsWith(route);
  });

  if (disableLayout) {
    // For login/register pages, just render the children directly
    return <>{children}</>;
  } else {
    // For all other pages, wrap children with the MainLayout
    return <MainLayout className={className}>{children}</MainLayout>; 
  }
} 