import Particles from '@/components/ui/Particles';
import Blob from '@/components/ui/Blob';
import HeroSection from '@/components/home/hero-section';
import UnifiedMainSection from '@/components/home/unified-main-section';

export default function Home() {
  return (
    <div className="min-h-screen bg-kswap-light bg-kswap-noise relative overflow-hidden">
      <Blob />
      <Particles />
      <div className="relative z-10">
        <HeroSection />
        <UnifiedMainSection />
      </div>
    </div>
  );
}