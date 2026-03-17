import type { Metadata } from "next";
import HeroSection from '@/components/home/hero-section';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: "Криптообменник в Калининграде — обмен USDT и криптовалют | KenigSwap",
  description:
    "KenigSwap — криптообменник в Калининграде. Обмен USDT, BTC, ETH, SOL и другой криптовалюты по выгодному курсу, сделки за наличные и безопасный сервис.",
};

const UnifiedMainSection = dynamic(
  () => import('@/components/home/unified-main-section'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />
      <UnifiedMainSection />
    </div>
  );
}
