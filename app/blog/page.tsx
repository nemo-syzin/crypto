import { Metadata } from 'next';
import { BlogPageClient } from './BlogPageClient';

export const metadata: Metadata = {
  title: 'Блог – KenigSwap',
  description: 'Новости криптовалютного рынка, аналитика, обзоры и обучающие материалы от экспертов KenigSwap. Следите за последними трендами и обновлениями.',
  keywords: ['блог', 'новости криптовалют', 'аналитика рынка', 'обзоры', 'обучающие материалы', 'криптовалютные тренды'],
  openGraph: {
    title: 'Блог – KenigSwap',
    description: 'Новости и аналитика криптовалютного рынка от экспертов KenigSwap',
    type: 'website',
    locale: 'ru_RU',
    images: [
      {
        url: '/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'KenigSwap Блог',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Блог – KenigSwap',
    description: 'Новости и аналитика криптовалютного рынка от экспертов KenigSwap',
    images: ['/og-blog.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/blog',
  },
};

// Enable static generation for this page
export const revalidate = 1800; // 30 minutes

export default function BlogPage() {
  return <BlogPageClient />;
}