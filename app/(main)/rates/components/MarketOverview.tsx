"use client";

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, PieChart } from 'lucide-react';
import type { Coin } from '@/lib/coingecko-api';
import type { MarketChart } from '@/lib/coingecko-api';

interface MarketOverviewProps {
  coins: Coin[];
  btcChartData: MarketChart | null;
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
      <div className="calculator-container hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition-transform duration-300">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium text-[#001D8D]/70">
            Total Market Cap
          </span>
        </div>
        <div className="text-3xl font-bold text-[#001D8D] mb-2">
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
      <div className="calculator-container hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 group-hover:scale-110 transition-transform duration-300">
            <Bitcoin className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium text-[#001D8D]/70">
            BTC Dominance
          </span>
        </div>
        <div className="text-3xl font-bold text-[#001D8D] mb-2">
          {btcDominance.toFixed(1)}%
        </div>
        <div className="text-sm text-[#001D8D]/70">
          ETH: {ethDominance.toFixed(1)}%
        </div>
        
        {/* Simple BTC price chart */}
        {btcPriceData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#001D8D]/60">BTC 30-day trend</span>
              <Badge variant="outline" className="text-xs">
                {btcPriceData[btcPriceData.length - 1] > btcPriceData[0] ? 'Bullish' : 'Bearish'}
              </Badge>
            </div>
            <div className="h-10 flex items-end">
              {btcPriceData.map((price, index) => {
                const min = Math.min(...btcPriceData);
                const max = Math.max(...btcPriceData);
                const range = max - min;
                const height = ((price - min) / range) * 100;
                
                return (
                  <div 
                    key={index}
                    className={`flex-1 mx-0.5 rounded-sm ${
                      index > 0 && price >= btcPriceData[index - 1] 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`}
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 24h Volume */}
      <div className="calculator-container hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 group-hover:scale-110 transition-transform duration-300">
            <PieChart className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium text-[#001D8D]/70">
            24h Trading Volume
          </span>
        </div>
        <div className="text-3xl font-bold text-[#001D8D] mb-2">
          {formatLargeNumber(totalVolume)}
        </div>
        <div className="text-sm text-[#001D8D]/70">
          Volume/Market Cap: {((totalVolume / totalMarketCap) * 100).toFixed(1)}%
        </div>
        
        {/* Volume distribution */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-[#001D8D]/60 mb-2">Volume distribution (Top 5)</div>
          <div className="space-y-2">
            {coins.slice(0, 5).map((coin) => (
              <div key={coin.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>{coin.symbol.toUpperCase()}</span>
                </div>
                <span className="text-[#001D8D]/70">
                  {((coin.total_volume / totalVolume) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}