"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Star, Flame, Zap, Crown } from 'lucide-react';
import type { CoinMarketData } from '@/lib/coingecko';

// Функция для проверки и исправления URL изображений
const getSafeImageUrl = (url: string): string => {
  // Заменяем coin-images.coingecko.com на assets.coingecko.com
  if (url && url.includes('coin-images.coingecko.com')) {
    return url.replace('coin-images.coingecko.com', 'assets.coingecko.com');
  }
  return url;
};

interface TrendingCoinsProps {
  coins: CoinMarketData[];
  onCoinClick: (coin: any) => void;
  loading?: boolean;
}

export function TrendingCoins({ coins, onCoinClick, loading }: TrendingCoinsProps) {
  // Calculate trending categories
  const topPerformers = useMemo(() => {
    if (!coins || coins.length === 0) return [];
    return [...coins]
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 3);
  }, [coins]);

  const mostVolume = useMemo(() => {
    if (!coins || coins.length === 0) return [];
    return [...coins]
      .sort((a, b) => b.total_volume - a.total_volume)
      .slice(0, 3);
  }, [coins]);

  const biggestMovers = useMemo(() => {
    if (!coins || coins.length === 0) return [];
    return [...coins]
      .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
      .slice(0, 3);
  }, [coins]);

  const formatPrice = (price: number): string => {
    if (price >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      }).format(price);
    }
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toLocaleString()}`;
  };

  const renderCoinItem = (coin: CoinMarketData, index: number, showVolume = false) => (
    <div
      key={coin.id}
      onClick={() => onCoinClick(coin)}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
    >
      <div className="relative">
        <Image 
          src={getSafeImageUrl(coin.image)} 
          alt={coin.name}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
          loading="lazy"
        />
        {index === 0 && (
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5">
            <Crown className="h-2 w-2 text-yellow-800" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[#001D8D] group-hover:text-blue-600 transition-colors truncate">
          {coin.symbol.toUpperCase()}
        </div>
        <div className="text-sm text-gray-500 truncate">
          {formatPrice(coin.current_price)}
        </div>
        {showVolume && (
          <div className="text-xs text-gray-400">
            Vol: {formatVolume(coin.total_volume)}
          </div>
        )}
      </div>
      
      <div className="text-right">
        <Badge 
          variant="outline" 
          className={`text-xs ${
            coin.price_change_percentage_24h >= 0
              ? 'border-green-200 text-green-700 bg-green-50'
              : 'border-red-200 text-red-700 bg-red-50'
          }`}
        >
          <span className="flex items-center gap-1">
            {coin.price_change_percentage_24h >= 0 ? (
              <TrendingUp className="h-2 w-2" />
            ) : (
              <TrendingDown className="h-2 w-2" />
            )}
            {coin.price_change_percentage_24h >= 0 ? '+' : ''}
            {coin.price_change_percentage_24h.toFixed(1)}%
          </span>
        </Badge>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="calculator-container animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="calculator-container hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600">
          <Star className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-[#001D8D]">Трендовые криптовалюты</h3>
        <Badge variant="outline" className="ml-auto text-xs">
          <Flame className="h-3 w-3 mr-1" />
          Горячие
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Performers */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-semibold text-[#001D8D]">Лидеры роста</h4>
          </div>
          <div className="space-y-2">
            {topPerformers.map((coin, index) => renderCoinItem(coin, index))}
          </div>
        </div>

        {/* Highest Volume */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-semibold text-[#001D8D]">Наибольший объем</h4>
          </div>
          <div className="space-y-2">
            {mostVolume.map((coin, index) => renderCoinItem(coin, index, true))}
          </div>
        </div>

        {/* Biggest Movers */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-semibold text-[#001D8D]">Наибольшие движения</h4>
          </div>
          <div className="space-y-2">
            {biggestMovers.map((coin, index) => renderCoinItem(coin, index))}
          </div>
        </div>
      </div>

      {/* Trending Summary */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {topPerformers[0]?.price_change_percentage_24h.toFixed(1)}%
            </div>
            <div className="text-sm text-green-800">Лучший результат</div>
            <div className="text-xs text-green-600">{topPerformers[0]?.symbol.toUpperCase()}</div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {formatVolume(mostVolume[0]?.total_volume || 0)}
            </div>
            <div className="text-sm text-blue-800">Наибольший объем</div>
            <div className="text-xs text-blue-600">{mostVolume[0]?.symbol.toUpperCase()}</div>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {Math.abs(biggestMovers[0]?.price_change_percentage_24h || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-purple-800">Наибольшее движение</div>
            <div className="text-xs text-purple-600">{biggestMovers[0]?.symbol.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}