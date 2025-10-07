import "@/styles/bg.css";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseAuthProvider } from "@/components/auth/SupabaseAuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

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

        {/* Yandex.Metrika counter */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

              ym(104446016, 'init', {
                ssr:true,
                webvisor:true,
                clickmap:true,
                ecommerce:"dataLayer",
                accurateTrackBounce:true,
                trackLinks:true
              });
            `,
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/104446016" style={{position:'absolute', left:'-9999px'}} alt="" />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}

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