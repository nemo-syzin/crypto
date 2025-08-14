import { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';

export const metadata: Metadata = {
  title: 'О нас – KenigSwap',
  description: 'Профессиональный криптосервис для безопасных и эффективных финансовых операций с криптовалютами. Узнайте о нашей миссии, видении и ценностях.',
  keywords: ['о компании', 'криптосервис', 'финансовые операции', 'криптовалюты', 'безопасность', 'профессионализм'],
  openGraph: {
    title: 'О нас – KenigSwap',
    description: 'Профессиональный криптосервис для безопасных финансовых операций',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/og-about.png',
        width: 1200,
        height: 630,
        alt: 'KenigSwap О нас',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'О нас – KenigSwap',
    description: 'Профессиональный криптосервис для безопасных финансовых операций',
    images: ['/og-about.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/about',
  },
};

// Enable static generation for this page
export const revalidate = 3600; // 1 hour

export default function AboutPage() {
  return <AboutPageClient />;
}