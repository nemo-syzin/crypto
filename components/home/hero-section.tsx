"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#001D8D] via-blue-700 to-blue-900 flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Фирменный логотип */}
          <div className="flex justify-center mb-8">
            <Image
              src="/brand/kenigswap-logo.svg"
              alt="KenigSwap"
              width={300}
              height={80}
              priority
              className="h-16 w-auto md:h-20 transition-transform hover:scale-105"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#001D8D] leading-tight">
            <span className="text-white">Обмен криптовалют</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              без границ
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            <span className="text-white/90">
            Быстрый и безопасный обмен более 100 криптовалют по лучшим курсам. 
            Без регистрации и скрытых комиссий.
            </span>
          </p>
          
          <Link href="/exchange">
            <Button
              size="lg"
              className="bg-white text-[#001D8D] hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 transform"
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