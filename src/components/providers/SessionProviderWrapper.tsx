'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

export default function SessionProviderWrapper({ children }: Props) {
  // You can optionally pass the session object here if needed for initial state,
  // but usually SessionProvider handles fetching it.
  return <SessionProvider>{children}</SessionProvider>;
} 