"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import HeroShell from "@/components/ui/HeroShell";

const HeroSection = () => {
  return (
    <HeroShell>
      <div className="relative flex items-center justify-center min-h-screen">
        <h1 className="sr-only">Обмен криптовалют в Калининграде</h1>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="flex justify-center mb-8">
              <Image
                src="/brand/kenigswap-logo.svg"
                alt="KenigSwap — обмен криптовалют"
                width={800}
                height={200}
                priority
                className="w-full max-w-4xl h-auto"
              />
            </div>

            <div>
              <Link href="/exchange">
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
      </div>
    </HeroShell>
  );
};

export default HeroSection;
