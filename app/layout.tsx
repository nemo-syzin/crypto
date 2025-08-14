import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { SupabaseAuthProvider } from '@/components/auth/SupabaseAuthProvider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'KenigSwap - USDT to RUB Exchange Platform',
  description: 'A modern crypto exchange platform specializing in USDT to RUB exchanges with competitive rates.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Preload critical fonts */}
        <link 
          rel="preload" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
          href="/fonts/Gilroy-ExtraBold.woff2" 
        />
        {/* Optimize viewport for mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        {/* Prevent flash of unstyled content */}
        <meta name="color-scheme" content="light" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://jetfadpysjsvtqdgnsjp.supabase.co" />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//assets.revolut.com" />
        <link rel="dns-prefetch" href="//assets.coingecko.com" />
        <link rel="dns-prefetch" href="//res.coinpaper.com" />
        <link rel="dns-prefetch" href="//api.alternative.me" />
      </head>
      <body className="min-h-screen mobile-optimized">
        <ThemeProvider
          attribute="class"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseAuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 mobile-container">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}