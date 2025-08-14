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
        {/* Optimized font preloading */}
        <link 
          rel="preload" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
          href="/fonts/Gilroy-ExtraBold.woff2"
        />
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com"
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous"
        />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://jetfadpysjsvtqdgnsjp.supabase.co" />
        {/* Optimized DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//assets.revolut.com" />
        <link rel="dns-prefetch" href="//assets.coingecko.com" />
        <link rel="dns-prefetch" href="//res.coinpaper.com" />
        <link rel="dns-prefetch" href="//api.alternative.me" />
        <link rel="dns-prefetch" href="//coin-images.coingecko.com" />
        <link rel="dns-prefetch" href="//images.pexels.com" />
        {/* Resource hints for better performance */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#001D8D" />
      </head>
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseAuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}