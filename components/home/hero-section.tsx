"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#001D8D] leading-tight">
            Обмен криптовалют
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#001D8D] to-blue-600">
              без границ
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Быстрый и безопасный обмен более 100 криптовалют по лучшим курсам. 
            Без регистрации и скрытых комиссий.
          </p>
          
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