import { Metadata } from 'next';
import { SupportPageClient } from './SupportPageClient';

export const metadata: Metadata = {
  title: 'Поддержка клиентов KenigSwap | Обмен криптовалют в Калининграде',
  description: 'Свяжитесь с поддержкой KenigSwap по вопросам обмена криптовалюты, покупки и продажи USDT, условий сделки, верификации и работы сервиса.',
  keywords: ['поддержка', 'помощь', 'FAQ', 'техническая поддержка', 'обмен криптовалют', 'служба поддержки'],
  openGraph: {
    title: 'Поддержка – KenigSwap',
    description: 'Профессиональная поддержка клиентов KenigSwap 24/7',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/og-support.png',
        width: 1200,
        height: 630,
        alt: 'KenigSwap Поддержка',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Поддержка – KenigSwap',
    description: 'Профессиональная поддержка клиентов KenigSwap 24/7',
    images: ['/og-support.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/support',
  },
};

export default function SupportPage() {
  return <SupportPageClient />;
}
