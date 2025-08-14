"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PerformanceOptimizedBackground } from '@/components/shared/PerformanceOptimizedBackground';

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {isMounted && (
        <div className="absolute inset-0 z-0 opacity-100">
          <PerformanceOptimizedBackground 
            primaryColor="#01278f"
            secondaryColor="#01278f"
            intensity={0.3}
          />
        </div>
      )}

      {/* Очень тонкий градиентный переход к следующему разделу */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-blue-50/20 z-5" />

      {/* Content over background */}
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <Image
              src="/brand/kenigswap-logo.svg"
              alt="Kenigswap"
              width={400}
              height={120}
              priority
              fetchPriority="high"
              className="h-auto w-auto"
            />
          </div>
          <p className="text-xl lg:text-2xl text-[#1E3A8A] mb-4">
            Официальный партнёр криптовалютной биржи Grinex
          </p>
          <p className="text-lg lg:text-xl text-[#1E3A8A] mb-8">
            Быстро. Надёжно. Конфиденциально
          </p>
          
          {/* Интерактивная кнопка без иконок */}
          <Link href="/exchange">
            <Button 
              size="lg"
              className="bg-[#001D8D] hover:bg-[#001D8D]/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 transform"
            >
              Начать обмен
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;