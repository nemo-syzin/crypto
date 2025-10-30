import HeroSection from '@/components/home/hero-section';
import dynamic from 'next/dynamic';

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