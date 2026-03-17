import { Metadata } from 'next';
import { RatesPageClient } from './RatesPageClient';

export const metadata: Metadata = {
  title: 'Курсы USDT, Bitcoin и криптовалют в Калининграде | KenigSwap',
  description: 'Актуальные курсы USDT, Bitcoin, ETH, SOL и другой криптовалюты. Следите за рыночными данными и выбирайте удобный момент для обмена в KenigSwap.',
  keywords: ['криптовалюты', 'курсы криптовалют', 'биткоин', 'эфириум', 'рыночные данные', 'индекс страха и жадности', 'актуальные цены'],
  openGraph: {
    title: 'Курсы криптовалют – KenigSwap',
    description: 'Актуальные курсы криптовалют и рыночная аналитика на базе CoinGecko',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/og-rates.png',
        width: 1200,
        height: 630,
        alt: 'KenigSwap Курсы криптовалют',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Курсы криптовалют – KenigSwap',
    description: 'Актуальные курсы криптовалют и рыночная аналитика',
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
