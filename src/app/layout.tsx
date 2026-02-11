import { Inter, JetBrains_Mono } from 'next/font/google';

import { ThemeProvider } from 'next-themes';

import { NavWrapper } from '@/components/layout/nav-wrapper';

import type { Metadata } from 'next';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NavWrapper />
          <main className="min-h-screen pb-20 md:pb-0">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
