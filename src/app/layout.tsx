import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neolish - AI Content Writer",
  description: "AI-powered content writing and editing tool",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/logos/neolish-icon-dark.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logos/neolish-icon-light.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
