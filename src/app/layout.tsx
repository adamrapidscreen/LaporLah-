import { Inter, JetBrains_Mono } from 'next/font/google';

import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';

import { NavWrapper } from '@/components/layout/nav-wrapper';
import { Toaster } from '@/components/ui/sonner';

import type { Metadata, Viewport } from 'next';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LaporLah! — Community Issue Reporting',
  description: 'Community-driven civic issue reporting for Malaysia',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <NextTopLoader 
          color="hsl(var(--primary))"
          showSpinner={false}
          height={3}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <NavWrapper />
          <main className="min-h-screen overflow-x-hidden pb-20 md:pb-0">
            {children}
          </main>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
