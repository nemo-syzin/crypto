"use client";
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';
import { useInView } from 'react-intersection-observer';

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Проверка предпочтений пользователя по уменьшению движения
  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  if (!isMounted) return null;

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Оптимизированный фон - рендерится только когда секция в поле зрения */}
      {inView && (
        <div className="absolute inset-0 z-0 opacity-100">
          <UnifiedVantaBackground 
            type="globe"
            color={0x01278f}
            color2={0x01278f}     
            backgroundColor={0xffffff} 
            scale={1.0}
            size={1}
            mouseControls={false} // Отключаем для экономии ресурсов
            touchControls={false} // Отключаем для экономии ресурсов
            gyroControls={false}
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