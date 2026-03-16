"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import HeroShell from "@/components/ui/HeroShell";

const HeroSection = () => {
  return (
    <HeroShell>
      <section className="relative flex items-center justify-center min-h-screen">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/brand/kenigswap-logo.svg"
                alt="KenigSwap — криптообменник в Калининграде"
                width={800}
                height={200}
                priority
                className="w-full max-w-4xl h-auto"
              />
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#001D8D] leading-tight">
                Обмен криптовалют в Калининграде
              </h1>
            </div>

            <div>
              <Link href="https://kenigswap.ru/exchange/">
                <Button
                  size="lg"
                  className="bg-[#001D8D] hover:bg-[#001D8D]/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Начать обмен
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </HeroShell>
  );
};

export default HeroSection;
