import "@/styles/bg.css";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseAuthProvider } from "@/components/auth/SupabaseAuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "KenigSwap - USDT to RUB Exchange Platform",
  description:
    "A modern crypto exchange platform specializing in USDT to RUB exchanges with competitive rates.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    siteName: 'KenigSwap',
    title: 'KenigSwap - USDT to RUB Exchange Platform',
    description: 'A modern crypto exchange platform specializing in USDT to RUB exchanges with competitive rates.',
    images: [
      {
        url: '/логотип.svg',
        width: 2000,
        height: 2000,
        alt: 'KenigSwap Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KenigSwap - USDT to RUB Exchange Platform',
    description: 'A modern crypto exchange platform specializing in USDT to RUB exchanges with competitive rates.',
    images: ['/логотип.svg'],
  },
};

export const viewport = {
  themeColor: '#011671',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//assets.revolut.com" />
        <link rel="dns-prefetch" href="//assets.coingecko.com" />
        <link rel="dns-prefetch" href="//res.coinpaper.com" />
        <link rel="dns-prefetch" href="//api.alternative.me" />
        <link rel="dns-prefetch" href="//mc.yandex.ru" />
      </head>
      <body>
        <YandexMetrika />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'KenigSwap',
              url: siteUrl,
              logo: `${siteUrl}/логотип.svg`,
              description: 'A modern crypto exchange platform specializing in USDT to RUB exchanges with competitive rates.',
              sameAs: [],
            }),
          }}
        />
      </body>
    </html>
  );
}