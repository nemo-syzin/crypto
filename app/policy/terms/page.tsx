import { Metadata } from 'next';
import { TermsOfServiceClient } from './TermsOfServiceClient';

export const metadata: Metadata = {
  title: 'Условия пользования – KenigSwap',
  description: 'Условия пользования сервисом KenigSwap (Пользовательское соглашение). Правила и условия использования криптовалютного обменного сервиса.',
  keywords: ['условия пользования', 'пользовательское соглашение', 'правила', 'криптовалютный обмен', 'KenigSwap'],
  openGraph: {
    title: 'Условия пользования – KenigSwap',
    description: 'Условия пользования сервисом KenigSwap (Пользовательское соглашение)',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/og-terms.png',
        width: 1200,
        height: 630,
        alt: 'KenigSwap Условия пользования',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Условия пользования – KenigSwap',
    description: 'Условия пользования сервисом KenigSwap (Пользовательское соглашение)',
    images: ['/og-terms.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/policy/terms',
  },
};

export default function TermsOfServicePage() {
  return <TermsOfServiceClient />;
}