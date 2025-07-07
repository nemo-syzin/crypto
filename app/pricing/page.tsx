import { Metadata } from 'next';
import { PricingPageClient } from './PricingPageClient';

export const metadata: Metadata = {
  title: 'Тарифы и цены – KenigSwap',
  description: 'Прозрачные тарифы на обмен криптовалют. Выберите подходящий план для частных лиц и бизнеса с выгодными комиссиями.',
  keywords: ['тарифы', 'цены', 'комиссии', 'планы', 'обмен криптовалют', 'стоимость услуг'],
  openGraph: {
    title: 'Тарифы и цены – KenigSwap',
    description: 'Прозрачные тарифы на обмен криптовалют с выгодными условиями',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/og-pricing.png',
        width: 1200,
        height: 630,
        alt: 'KenigSwap Тарифы',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Тарифы и цены – KenigSwap',
    description: 'Прозрачные тарифы на обмен криптовалют с выгодными условиями',
    images: ['/og-pricing.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingPage() {
  return <PricingPageClient />;
}