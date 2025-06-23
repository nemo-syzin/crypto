import { Metadata } from 'next';
import { RatesPageClient } from './RatesPageClient';

export const metadata: Metadata = {
  title: 'Crypto Rates – KenigSwap',
  description: 'Real-time cryptocurrency rates, market data, and analysis. Track top cryptocurrencies, market trends, and Fear & Greed Index.',
  keywords: ['cryptocurrency', 'crypto rates', 'bitcoin', 'ethereum', 'market data', 'fear greed index', 'coingecko', 'live prices'],
  openGraph: {
    title: 'Crypto Rates – KenigSwap',
    description: 'Real-time cryptocurrency rates and market analysis powered by CoinGecko',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-rates.png',
        width: 1200,
        height: 630,
        alt: 'KenigSwap Crypto Rates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Rates – KenigSwap',
    description: 'Real-time cryptocurrency rates and market analysis',
    images: ['/og-rates.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/rates',
  },
};

export default function RatesPage() {
  return <RatesPageClient />;
}