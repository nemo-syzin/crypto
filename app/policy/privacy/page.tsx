import { Metadata } from 'next';
import { PrivacyPolicyClient } from './PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности – KenigSwap',
  description: 'Политика конфиденциальности криптовалютного обменного сервиса KenigSwap. Обработка и защита персональных данных пользователей.',
  keywords: ['политика конфиденциальности', 'персональные данные', 'защита данных', 'обработка данных', 'конфиденциальность', 'GDPR'],
  openGraph: {
    title: 'Политика конфиденциальности – KenigSwap',
    description: 'Политика обработки и защиты персональных данных пользователей',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/og-privacy.png',
        width: 1200,
        height: 630,
        alt: 'KenigSwap Политика конфиденциальности',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Политика конфиденциальности – KenigSwap',
    description: 'Политика обработки и защиты персональных данных пользователей',
    images: ['/og-privacy.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/policy/privacy',
  },
};

// Enable static generation for this page
export const revalidate = 86400; // 24 hours

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}