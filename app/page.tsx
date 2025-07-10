import HeroSection from '@/components/home/hero-section';
import UnifiedMainSection from '@/components/home/unified-main-section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KenigSwap - USDT to RUB Exchange Platform',
  description: 'A modern crypto exchange platform specializing in USDT to RUB exchanges with competitive rates and secure transactions.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <HeroSection />
      <UnifiedMainSection />
    </div>
  );
}