import React from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

export interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      {/* Add pt-16 for Navbar spacing, keep other paddings */}
      {/* Original classes: "flex-1 pt-6 pb-6 pr-6 pl-[calc(16rem+1.5rem)]" */}
      <main className={cn("flex-1 pt-4 pb-6 pr-6 pl-[calc(16rem+1.5rem)] overflow-x-auto", className)}>
        {children}
      </main>
    </div>
  );
}