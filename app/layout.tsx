import './globals.css';
import '../styles/bg.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { SupabaseAuthProvider } from '@/components/auth/SupabaseAuthProvider';
import { Toaster } from '@/components/ui/toaster';
import Blob from '@/components/ui/Blob';
import Particles from '@/components/ui/Particles';
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
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//assets.revolut.com" />
        <link rel="dns-prefetch" href="//assets.coingecko.com" />
        <link rel="dns-prefetch" href="//res.coinpaper.com" />
        <link rel="dns-prefetch" href="//api.alternative.me" />
      </head>
      <body className="bg-kswap-light bg-kswap-noise min-h-screen relative overflow-hidden">
        {/* Глобальные фоновые элементы */}
        <Blob />
        <Particles />
        
        {/* Весь контент поверх фона */}
        <div className="relative z-10">
        <ThemeProvider
          attribute="class"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseAuthProvider>
            <div className="flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </SupabaseAuthProvider>
        </ThemeProvider>
        </div>
      </body>
    </html>
  );
}