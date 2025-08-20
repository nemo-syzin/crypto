import HeroSection from '@/components/home/hero-section';
import UnifiedMainSection from '@/components/home/unified-main-section';

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <HeroSection />
      <UnifiedMainSection />
    </div>
  );
}