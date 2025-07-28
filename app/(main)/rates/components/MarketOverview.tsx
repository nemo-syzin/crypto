"use client";

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, PieChart } from 'lucide-react';
import type { CoinMarketData } from '@/lib/coingecko';

interface MarketOverviewProps {
  coins: CoinMarketData[];
  btcChartData: any | null;
  loading?: boolean;
}

export function MarketOverview({ coins, btcChartData, loading }: MarketOverviewProps) {
  // Calculate total market cap
  const totalMarketCap = useMemo(() => {
    if (!coins || coins.length === 0) return 0;
    return coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  }, [coins]);

  // Calculate total 24h volume
  const totalVolume = useMemo(() => {
    if (!coins || coins.length === 0) return 0;
    return coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
  }, [coins]);

  // Calculate market cap change percentage
  const marketCapChangePercentage = useMemo(() => {
    if (!coins || coins.length === 0) return 0;
    const totalChange = coins.reduce((sum, coin) => {
      return sum + (coin.market_cap_change_percentage_24h || 0) * (coin.market_cap || 0);
    }, 0);
    return totalChange / totalMarketCap;
  }, [coins, totalMarketCap]);

  // Calculate BTC dominance
  const btcDominance = useMemo(() => {
    if (!coins || coins.length === 0) return 0;
    const btc = coins.find(coin => coin.id === 'bitcoin');
    if (!btc) return 0;
    return (btc.market_cap / totalMarketCap) * 100;
  }, [coins, totalMarketCap]);

  // Calculate ETH dominance
  const ethDominance = useMemo(() => {
    if (!coins || coins.length === 0) return 0;
    const eth = coins.find(coin => coin.id === 'ethereum');
    if (!eth) return 0;
    return (eth.market_cap / totalMarketCap) * 100;
  }, [coins, totalMarketCap]);

  // Format large numbers
  const formatLargeNumber = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  // Create BTC price chart data
  const btcPriceData = useMemo(() => {
    if (!btcChartData || !btcChartData.prices) return [];
    
    // Get last 30 days of data, sampling every 3 days
    const data = btcChartData.prices;
    const sampledData = [];
    
    for (let i = 0; i < data.length; i += Math.floor(data.length / 10)) {
      if (sampledData.length < 10) {
        sampledData.push(data[i][1]);
      }
    }
    
    return sampledData;
  }, [btcChartData]);

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
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs font-medium text-[#001D8D]/70">
            Общая капитализация
          </span>
        </div>
        <div className="text-2xl font-bold text-[#001D8D] mb-1">
          {formatLargeNumber(totalMarketCap)}
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          marketCapChangePercentage >= 0 
            ? 'text-green-600' 
            : 'text-red-600'
        }`}>
          {marketCapChangePercentage >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {Math.abs(marketCapChangePercentage).toFixed(2)}% (24h)
        </div>
      </div>

      {/* BTC Dominance */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
            <Bitcoin className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs font-medium text-[#001D8D]/70">
            Доминирование BTC
          </span>
        </div>
        <div className="text-2xl font-bold text-[#001D8D] mb-1">
          {btcDominance.toFixed(1)}%
        </div>
        <div className="text-xs text-[#001D8D]/70">
          ETH: {ethDominance.toFixed(1)}%
        </div>
      </div>

      {/* 24h Volume */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
            <PieChart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs font-medium text-[#001D8D]/70">
            Объем торгов 24ч
          </span>
        </div>
        <div className="text-2xl font-bold text-[#001D8D] mb-1">
          {formatLargeNumber(totalVolume)}
        </div>
        <div className="text-xs text-[#001D8D]/70">
          Объем/Капитализация: {((totalVolume / totalMarketCap) * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
}