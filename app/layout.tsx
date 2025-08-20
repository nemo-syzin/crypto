import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseAuthProvider } from "@/components/auth/SupabaseAuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
// Глобальные декоративные элементы
import Blob from "@/components/ui/Blob";
import Particles from "@/components/ui/Particles";

export const metadata: Metadata = {
  title: "KenigSwap - USDT to RUB Exchange Platform",
  description:
    "A modern crypto exchange platform specializing in USDT to RUB exchanges with competitive rates.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
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
        {/* Глобальный фон с Blob и Particles */}
        <div className="relative min-h-screen overflow-hidden">
          {/* Декоративные элементы фона */}
          <div className="pointer-events-none absolute inset-0">
            <Blob />
            <Particles />
          </div>

          {/* Весь контент приложения поверх фона */}
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