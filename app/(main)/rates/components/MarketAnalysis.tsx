"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Zap, Target, AlertCircle } from 'lucide-react';
import type { CoinMarketData } from '@/lib/coingecko';

interface MarketAnalysisProps {
  coins: CoinMarketData[];
  loading?: boolean;
}

export function MarketAnalysis({ coins, loading }: MarketAnalysisProps) {
  if (loading) {
    return (
      <div className="calculator-container animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate market analysis metrics
  const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);
  const totalVolume = coins.reduce((sum, coin) => sum + coin.total_volume, 0);
  
  const gainers = coins.filter(coin => coin.price_change_percentage_24h > 0);
  const losers = coins.filter(coin => coin.price_change_percentage_24h < 0);
  
  const avgChange24h = coins.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0) / coins.length;
  
  const highVolatility = coins.filter(coin => Math.abs(coin.price_change_percentage_24h) > 5);
  
  const getMarketMood = () => {
    const gainersPercent = (gainers.length / coins.length) * 100;
    if (gainersPercent > 70) return { mood: 'Очень бычий', color: 'text-green-700', bg: 'bg-green-100' };
    if (gainersPercent > 55) return { mood: 'Бычий', color: 'text-green-600', bg: 'bg-green-50' };
    if (gainersPercent > 45) return { mood: 'Нейтральный', color: 'text-gray-600', bg: 'bg-gray-50' };
    if (gainersPercent > 30) return { mood: 'Медвежий', color: 'text-red-600', bg: 'bg-red-50' };
    return { mood: 'Очень медвежий', color: 'text-red-700', bg: 'bg-red-100' };
  };

  const marketMood = getMarketMood();

  return (
    <div className="calculator-container hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-[#001D8D]">Анализ рынка</h3>
        <Badge variant="outline" className="ml-auto text-xs">
          Топ-{coins.length} монет
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Market Sentiment */}
        <div className={`p-4 rounded-lg ${marketMood.bg} border border-current/20`}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className={`h-4 w-4 ${marketMood.color}`} />
            <span className="text-sm font-medium text-gray-700">Настроение рынка</span>
          </div>
          <div className={`text-2xl font-bold ${marketMood.color} mb-1`}>
            {marketMood.mood}
          </div>
          <div className="text-sm text-gray-600">
            {gainers.length} растут, {losers.length} падают
          </div>
        </div>

        {/* Average Change */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Среднее изменение</span>
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            avgChange24h >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {avgChange24h >= 0 ? '+' : ''}{avgChange24h.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-600">
            За 24 часа
          </div>
        </div>

        {/* Volume to Market Cap Ratio */}
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Коэффициент оборота</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {((totalVolume / totalMarketCap) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            Объем/Капитализация
          </div>
        </div>

        {/* High Volatility */}
        <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Высокая волатильность</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {highVolatility.length}
          </div>
          <div className="text-sm text-gray-600">
            Монет с изменением >5%
          </div>
        </div>
      </div>
    </div>
  );
}