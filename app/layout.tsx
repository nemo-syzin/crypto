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
    <html lang="ru" className="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: `
          try {
            const t = localStorage.getItem('theme');
            if (t && t !== 'light') localStorage.setItem('theme','light');
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
          } catch (e) {}
        `}} />
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
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 z-0">
              <Particles />
            </div>
            <Particles />
          </div>

          <div className="relative z-10">
            <ThemeProvider 
              attribute="class" 
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <SupabaseAuthProvider>
                <Header />
                <main className="flex-1 bg-transparent">{children}</main>
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