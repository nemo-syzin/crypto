"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Globe, Bitcoin, Activity } from 'lucide-react';
import { getFearGreedColor, getFearGreedBgColor } from '@/lib/fng';
import type { GlobalMarketData, FearGreedData } from '@/lib/coingecko';

interface GlobalSummaryProps {
  global: GlobalMarketData | null;
  fearGreed: FearGreedData | null;
  loading?: boolean;
}

export function GlobalSummary({ global, fearGreed, loading }: GlobalSummaryProps) {
  const formatMarketCap = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const fearGreedValue = fearGreed ? parseInt(fearGreed.value) : 50;
  const fearGreedColor = getFearGreedColor(fearGreedValue);
  const fearGreedBg = getFearGreedBgColor(fearGreedValue);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="calculator-container animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Market Cap */}
      <div className="calculator-container hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition-transform duration-300">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium text-[#001D8D]/70">
            Общая капитализация
          </span>
        </div>
        <div className="text-3xl font-bold text-[#001D8D] mb-2">
          {global ? formatMarketCap(global.data.total_market_cap.usd) : 'N/A'}
        </div>
        {global && (
          <div className={`flex items-center gap-1 text-sm ${
            global.data.market_cap_change_percentage_24h_usd >= 0 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {global.data.market_cap_change_percentage_24h_usd >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {Math.abs(global.data.market_cap_change_percentage_24h_usd).toFixed(2)}% (24ч)
          </div>
        )}
      </div>

      {/* BTC Dominance */}
      <div className="calculator-container hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 group-hover:scale-110 transition-transform duration-300">
            <Bitcoin className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium text-[#001D8D]/70">
            Доминирование BTC
          </span>
        </div>
        <div className="text-3xl font-bold text-[#001D8D] mb-2">
          {global ? `${global.data.market_cap_percentage.btc.toFixed(1)}%` : 'N/A'}
        </div>
        <div className="text-sm text-[#001D8D]/70">
          ETH: {global ? `${global.data.market_cap_percentage.eth?.toFixed(1) || 'N/A'}%` : 'N/A'}
        </div>
      </div>

      {/* Fear & Greed Index */}
      <div className="calculator-container hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 group-hover:scale-110 transition-transform duration-300">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium text-[#001D8D]/70">
            Индекс страха и жадности
          </span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl font-bold text-[#001D8D]">
            {fearGreed ? fearGreed.value : '50'}
          </div>
          <Badge className={`${fearGreedBg} ${fearGreedColor} border-0`}>
            {fearGreed ? fearGreed.value_classification : 'Нейтрально'}
          </Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              fearGreedValue <= 25 ? 'bg-red-500' :
              fearGreedValue <= 45 ? 'bg-orange-500' :
              fearGreedValue <= 55 ? 'bg-yellow-500' :
              fearGreedValue <= 75 ? 'bg-green-500' :
              'bg-blue-500'
            }`}
            style={{ width: `${fearGreedValue}%` }}
          />
        </div>
      </div>
    </div>
  );
}