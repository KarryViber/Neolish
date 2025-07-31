import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import "../globals.css";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import HelpGuide from "@/components/HelpGuide";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { locales, type Locale } from "@/i18n/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params
}: RootLayoutProps) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // 明确传递locale参数给getMessages
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="h-full bg-white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProviderWrapper>
            <LayoutWrapper>{children}</LayoutWrapper>
            <HelpGuide />
          </SessionProviderWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Neolish - AI Content Writer",
    description: "AI-powered content writing and editing tool",
    icons: {
      icon: [
        {
          url: '/favicon.svg',
          type: 'image/svg+xml',
          sizes: 'any',
        },
      ],
      shortcut: '/favicon.svg',
      apple: '/favicon.svg',
    },
  };
} 