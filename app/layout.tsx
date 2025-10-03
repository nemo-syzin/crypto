import "@/styles/bg.css";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseAuthProvider } from "@/components/auth/SupabaseAuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "KenigSwap - USDT to RUB Exchange Platform",
  description:
    "A modern crypto exchange platform specializing in USDT to RUB exchanges with competitive rates.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' }
    ]
  },
  themeColor: '#0B6BF2',
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0B6BF2" />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href="/fonts/Gilroy-ExtraBold.woff2"
        />
        <link rel="dns-prefetch" href="//assets.revolut.com" />
        <link rel="dns-prefetch" href="//assets.coingecko.com" />
        <link rel="dns-prefetch" href="//res.coinpaper.com" />
        <link rel="dns-prefetch" href="//api.alternative.me" />
      </head>
      <body>
        {/* Глобальный фон: анимированный градиент из .app-bg + 2 CSS-блоба */}
        <div id="app-root" className="app-bg min-h-screen relative overflow-hidden">
          {/* Блоб-слой (НЕ перехватывает клики), -z-10 чтобы быть под контентом */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            {/* верх-лево, виден везде */}
            <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-blue-300/20 blur-3xl" />
            {/* низ-право, скрыть на мобилках для перфа */}
            <div className="hidden md:block absolute -bottom-32 -right-20 w-[520px] h-[520px] rounded-full bg-indigo-400/15 blur-3xl" />
          </div>

          {/* Контент поверх */}
          <div className="relative z-10 min-h-screen flex flex-col">
            <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
              <SupabaseAuthProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster />
              </SupabaseAuthProvider>
            </ThemeProvider>
          </div>
        </div>
      </body>
    </html>
  );
}