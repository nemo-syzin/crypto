"use client";

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Zap, Target, AlertCircle } from 'lucide-react';
import type { Coin } from '@/lib/coingecko-api';

interface MarketStatsProps {
  coins: Coin[];
  loading?: boolean;
}

export function MarketStats({ coins, loading }: MarketStatsProps) {
  // Calculate market analysis metrics
  const totalMarketCap = useMemo(() => {
    if (!coins || coins.length === 0) return 0;
    return coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  }, [coins]);
  
  const totalVolume = useMemo(() => {
    if (!coins || coins.length === 0) return 0;
    return coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
  }, [coins]);
  
  const gainers = useMemo(() => {
    if (!coins || coins.length === 0) return [];
    return coins.filter(coin => coin.price_change_percentage_24h > 0);
  }, [coins]);
  
  const losers = useMemo(() => {
    if (!coins || coins.length === 0) return [];
    return coins.filter(coin => coin.price_change_percentage_24h < 0);
  }, [coins]);
  
  const avgChange24h = useMemo(() => {
    if (!coins || coins.length === 0) return 0;
    return coins.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0) / coins.length;
  }, [coins]);
  
  const highVolatility = useMemo(() => {
    if (!coins || coins.length === 0) return [];
    return coins.filter(coin => Math.abs(coin.price_change_percentage_24h) > 5);
  }, [coins]);
  
  const getMarketMood = useMemo(() => {
    if (!coins || coins.length === 0) return { mood: 'Neutral', color: 'text-gray-600', bg: 'bg-gray-50' };
    
    const gainersPercent = (gainers.length / coins.length) * 100;
    if (gainersPercent > 70) return { mood: 'Very Bullish', color: 'text-green-700', bg: 'bg-green-100' };
    if (gainersPercent > 55) return { mood: 'Bullish', color: 'text-green-600', bg: 'bg-green-50' };
    if (gainersPercent > 45) return { mood: 'Neutral', color: 'text-gray-600', bg: 'bg-gray-50' };
    if (gainersPercent > 30) return { mood: 'Bearish', color: 'text-red-600', bg: 'bg-red-50' };
    return { mood: 'Very Bearish', color: 'text-red-700', bg: 'bg-red-100' };
  }, [coins, gainers.length]);

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

  return (
    <div className="calculator-container hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-[#001D8D]">Market Analysis</h3>
        <Badge variant="outline" className="ml-auto text-xs">
          Top {coins.length} coins
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Market Sentiment */}
        <div className={`p-4 rounded-lg ${getMarketMood.bg} border border-current/20`}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className={`h-4 w-4 ${getMarketMood.color}`} />
            <span className="text-sm font-medium text-gray-700">Market Sentiment</span>
          </div>
          <div className={`text-2xl font-bold ${getMarketMood.color} mb-1`}>
            {getMarketMood.mood}
          </div>
          <div className="text-sm text-gray-600">
            {gainers.length} gainers, {losers.length} losers
          </div>
        </div>

        {/* Average Change */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Average Change</span>
          </div>
          <div className={`text-2xl font-bold mb-1 ${
            avgChange24h >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {avgChange24h >= 0 ? '+' : ''}{avgChange24h.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-600">
            Last 24 hours
          </div>
        </div>

        {/* Volume to Market Cap Ratio */}
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Turnover Ratio</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {((totalVolume / totalMarketCap) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            Volume/Market Cap
          </div>
        </div>

        {/* High Volatility */}
        <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">High Volatility</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {highVolatility.length}
          </div>
          <div className="text-sm text-gray-600">
            Coins with >5% change
          </div>
        </div>
      </div>
      
      {/* Additional Market Insights */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-lg font-semibold text-[#001D8D] mb-4">Market Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gainers vs Losers */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Gainers vs Losers</div>
              <Badge variant="outline" className="text-xs">24h</Badge>
            </div>
            
            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div 
                className="absolute left-0 top-0 h-full bg-green-500 rounded-l-full"
                style={{ width: `${(gainers.length / coins.length) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span>Gainers: {gainers.length} ({((gainers.length / coins.length) * 100).toFixed(0)}%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-1"></div>
                <span>Losers: {losers.length} ({((losers.length / coins.length) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>
          
          {/* Market Health */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">Market Health</div>
              <div className={`px-2 py-0.5 rounded text-xs ${
                avgChange24h > 3 ? 'bg-green-100 text-green-800' :
                avgChange24h > 0 ? 'bg-green-50 text-green-600' :
                avgChange24h > -3 ? 'bg-red-50 text-red-600' :
                'bg-red-100 text-red-800'
              }`}>
                {avgChange24h > 3 ? 'Very Healthy' :
                 avgChange24h > 0 ? 'Healthy' :
                 avgChange24h > -3 ? 'Cautious' :
                 'Unhealthy'}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Volatility</span>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full mx-0.5 ${
                        highVolatility.length / coins.length > i * 0.2 
                          ? 'bg-orange-500' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Liquidity</span>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full mx-0.5 ${
                        (totalVolume / totalMarketCap) > i * 0.05 
                          ? 'bg-blue-500' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Market Breadth</span>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full mx-0.5 ${
                        (gainers.length / coins.length) > 0.4 + (i * 0.1)
                          ? 'bg-green-500' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}