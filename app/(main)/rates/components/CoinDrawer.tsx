"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, X, Activity, Star, Globe, Info, DollarSign, BarChart3, Clock, Zap } from 'lucide-react';
import type { CoinMarketData } from '@/lib/coingecko';

interface CoinDrawerProps {
  coin: CoinMarketData | null;
  open: boolean;
  onClose: () => void;
}

export function CoinDrawer({ coin, open, onClose }: CoinDrawerProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'stats' | 'analysis'>('overview');

  if (!coin) return null;

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

  const formatMarketCap = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatSupply = (value: number | null): string => {
    if (!value) return 'N/A';
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toLocaleString();
  };

  const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'N/A';
    }
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Calculate price volatility indicator
  const getVolatilityLevel = (): { level: string; color: string; description: string } => {
    const change24h = Math.abs(coin.price_change_percentage_24h || 0);
    if (change24h < 2) return { level: 'Low', color: 'text-green-600', description: 'Stable price movement' };
    if (change24h < 5) return { level: 'Medium', color: 'text-yellow-600', description: 'Moderate price swings' };
    if (change24h < 10) return { level: 'High', color: 'text-orange-600', description: 'Significant volatility' };
    return { level: 'Very High', color: 'text-red-600', description: 'Extreme price movements' };
  };

  // Calculate market sentiment
  const getMarketSentiment = (): { sentiment: string; color: string; icon: React.ReactNode } => {
    const change24h = coin.price_change_percentage_24h || 0;
    const change7d = coin.price_change_percentage_7d_in_currency || 0;
    
    if (change24h > 5 && change7d > 10) {
      return { sentiment: 'Very Bullish', color: 'text-green-700', icon: <TrendingUp className="h-4 w-4" /> };
    } else if (change24h > 0 && change7d > 0) {
      return { sentiment: 'Bullish', color: 'text-green-600', icon: <TrendingUp className="h-4 w-4" /> };
    } else if (change24h < -5 && change7d < -10) {
      return { sentiment: 'Very Bearish', color: 'text-red-700', icon: <TrendingDown className="h-4 w-4" /> };
    } else if (change24h < 0 && change7d < 0) {
      return { sentiment: 'Bearish', color: 'text-red-600', icon: <TrendingDown className="h-4 w-4" /> };
    } else {
      return { sentiment: 'Neutral', color: 'text-gray-600', icon: <Activity className="h-4 w-4" /> };
    }
  };

  const volatility = getVolatilityLevel();
  const sentiment = getMarketSentiment();

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh] bg-white border-t-4 border-[#001D8D]">
        {/* Enhanced Header with KenigSwap branding */}
        <DrawerHeader className="bg-gradient-to-r from-[#001D8D] to-blue-700 text-white border-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={coin.image} 
                  alt={coin.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                />
                <div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                  <Star className="h-3 w-3 text-[#001D8D]" />
                </div>
              </div>
              <div>
                <DrawerTitle className="text-white text-xl font-bold">{coin.name}</DrawerTitle>
                <div className="text-white/90 font-medium">{coin.symbol.toUpperCase()}</div>
                <div className="text-white/70 text-sm">Rank #{coin.market_cap_rank}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-white/90 text-sm">Current Price</div>
                <div className="text-white font-bold text-lg">{formatPrice(coin.current_price)}</div>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto bg-gray-50">
          {/* Price Overview with enhanced styling */}
          <div className="mb-8">
            <Card className="bg-white border-2 border-[#001D8D]/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-4xl font-bold text-[#001D8D] mb-2">
                      {formatPrice(coin.current_price)}
                    </div>
                    <div className="text-[#001D8D]/70 text-sm">
                      Last updated: {new Date(coin.last_updated).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      className={`text-lg px-4 py-2 ${
                        (coin.price_change_percentage_24h || 0) >= 0
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {(coin.price_change_percentage_24h || 0) >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {formatPercentage(coin.price_change_percentage_24h)} (24h)
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Information Tabs */}
          <div className="mb-8">
            <Card className="bg-white border-2 border-[#001D8D]/20 shadow-lg">
              <CardContent className="p-6">
                <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'overview' | 'stats' | 'analysis')} className="w-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-[#001D8D]" />
                      <span className="text-lg font-bold text-[#001D8D]">
                        Detailed Information
                      </span>
                    </div>
                    <TabsList className="bg-[#001D8D]/10 border border-[#001D8D]/20">
                      <TabsTrigger value="overview" className="data-[state=active]:bg-[#001D8D] data-[state=active]:text-white">Overview</TabsTrigger>
                      <TabsTrigger value="stats" className="data-[state=active]:bg-[#001D8D] data-[state=active]:text-white">Statistics</TabsTrigger>
                      <TabsTrigger value="analysis" className="data-[state=active]:bg-[#001D8D] data-[state=active]:text-white">Analysis</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Market Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-900">Market Position</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-700 mb-1">#{coin.market_cap_rank}</div>
                        <div className="text-sm text-blue-600">Global ranking by market cap</div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-900">Market Cap</span>
                        </div>
                        <div className="text-2xl font-bold text-green-700 mb-1">{formatMarketCap(coin.market_cap)}</div>
                        <div className="text-sm text-green-600">Total market value</div>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">24-Hour Price Range</h4>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-red-600 font-medium">
                          Low: {formatPrice(coin.low_24h)}
                        </div>
                        <div className="text-green-600 font-medium">
                          High: {formatPrice(coin.high_24h)}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 relative">
                        <div 
                          className="bg-gradient-to-r from-red-400 to-green-400 h-2 rounded-full"
                          style={{ width: '100%' }}
                        />
                        <div 
                          className="absolute top-0 w-3 h-3 bg-[#001D8D] rounded-full border-2 border-white shadow-lg transform -translate-y-0.5"
                          style={{ 
                            left: `${((coin.current_price - coin.low_24h) / (coin.high_24h - coin.low_24h)) * 100}%`,
                            transform: 'translateX(-50%) translateY(-2px)'
                          }}
                        />
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-600">
                        Current: {formatPrice(coin.current_price)}
                      </div>
                    </div>

                    {/* Supply Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20">
                        <div className="text-sm text-[#001D8D]/70 mb-1 font-medium">Circulating Supply</div>
                        <div className="text-xl font-bold text-[#001D8D]">
                          {formatSupply(coin.circulating_supply)}
                        </div>
                        <div className="text-xs text-[#001D8D]/50">{coin.symbol.toUpperCase()}</div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20">
                        <div className="text-sm text-[#001D8D]/70 mb-1 font-medium">Max Supply</div>
                        <div className="text-xl font-bold text-[#001D8D]">
                          {coin.max_supply ? formatSupply(coin.max_supply) : 'Unlimited'}
                        </div>
                        <div className="text-xs text-[#001D8D]/50">
                          {coin.max_supply ? `${((coin.circulating_supply / coin.max_supply) * 100).toFixed(1)}% in circulation` : 'No maximum limit'}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="space-y-6">
                    {/* Trading Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20">
                        <div className="text-sm text-[#001D8D]/70 mb-1 font-medium">24h Volume</div>
                        <div className="text-xl font-bold text-[#001D8D]">
                          {formatMarketCap(coin.total_volume)}
                        </div>
                        <div className="text-xs text-[#001D8D]/50">Trading activity</div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20">
                        <div className="text-sm text-[#001D8D]/70 mb-1 font-medium">Volume/Market Cap</div>
                        <div className="text-xl font-bold text-[#001D8D]">
                          {((coin.total_volume / coin.market_cap) * 100).toFixed(2)}%
                        </div>
                        <div className="text-xs text-[#001D8D]/50">Liquidity indicator</div>
                      </div>
                    </div>

                    {/* All-Time Records */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <div className="text-sm text-green-700 mb-1 font-medium">All-Time High</div>
                        <div className="text-xl font-bold text-green-600 mb-1">
                          {formatPrice(coin.ath)}
                        </div>
                        <div className="text-xs text-green-600">
                          {new Date(coin.ath_date).toLocaleDateString()}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded mt-2 ${
                          (coin.ath_change_percentage || 0) >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                        }`}>
                          {formatPercentage(coin.ath_change_percentage)} from ATH
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                        <div className="text-sm text-red-700 mb-1 font-medium">All-Time Low</div>
                        <div className="text-xl font-bold text-red-600 mb-1">
                          {formatPrice(coin.atl)}
                        </div>
                        <div className="text-xs text-red-600">
                          {new Date(coin.atl_date).toLocaleDateString()}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded mt-2 ${
                          (coin.atl_change_percentage || 0) >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                        }`}>
                          {formatPercentage(coin.atl_change_percentage)} from ATL
                        </div>
                      </div>
                    </div>

                    {/* Price Changes */}
                    <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20">
                      <h4 className="font-semibold text-[#001D8D] mb-3">Price Performance</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">1 Hour</div>
                          <div className={`font-bold ${
                            (coin.price_change_percentage_1h_in_currency || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(coin.price_change_percentage_1h_in_currency)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">24 Hours</div>
                          <div className={`font-bold ${
                            (coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(coin.price_change_percentage_24h)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">7 Days</div>
                          <div className={`font-bold ${
                            (coin.price_change_percentage_7d_in_currency || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(coin.price_change_percentage_7d_in_currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-6">
                    {/* Market Sentiment */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <h4 className="font-bold text-blue-900">Market Sentiment Analysis</h4>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {sentiment.icon}
                          <span className={`font-bold text-lg ${sentiment.color}`}>
                            {sentiment.sentiment}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-blue-700">Based on price trends</div>
                        </div>
                      </div>
                      <div className="text-sm text-blue-800">
                        Market sentiment is determined by analyzing short-term and long-term price movements, 
                        indicating the overall market mood towards this cryptocurrency.
                      </div>
                    </div>

                    {/* Volatility Analysis */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        <h4 className="font-bold text-yellow-900">Volatility Assessment</h4>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className={`font-bold text-lg ${volatility.color}`}>
                            {volatility.level} Volatility
                          </span>
                          <div className="text-sm text-yellow-800 mt-1">
                            {volatility.description}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-700">
                            {Math.abs(coin.price_change_percentage_24h || 0).toFixed(1)}%
                          </div>
                          <div className="text-xs text-yellow-600">24h movement</div>
                        </div>
                      </div>
                      <div className="text-sm text-yellow-800">
                        Volatility measures price fluctuation intensity. Higher volatility indicates 
                        greater risk but also potential for higher returns.
                      </div>
                    </div>

                    {/* Trading Insights */}
                    <div className="bg-white p-6 rounded-lg border-2 border-[#001D8D]/20">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-[#001D8D]" />
                        <h4 className="font-bold text-[#001D8D]">Trading Insights</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-sm font-medium text-gray-700">Market Cap Rank</span>
                          <span className="font-bold text-[#001D8D]">#{coin.market_cap_rank}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-sm font-medium text-gray-700">Fully Diluted Valuation</span>
                          <span className="font-bold text-[#001D8D]">
                            {coin.fully_diluted_valuation ? formatMarketCap(coin.fully_diluted_valuation) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-sm font-medium text-gray-700">Market Cap Change (24h)</span>
                          <span className={`font-bold ${
                            (coin.market_cap_change_percentage_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(coin.market_cap_change_percentage_24h)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Footer with KenigSwap branding */}
          <Card className="bg-gradient-to-r from-[#001D8D] to-blue-700 text-white border-none shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Globe className="h-8 w-8" />
                  <div>
                    <div className="font-bold text-lg">Powered by KenigSwap</div>
                    <div className="text-white/90 text-sm">Professional crypto analysis platform</div>
                    <div className="text-white/70 text-xs mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Data updated: {new Date(coin.last_updated).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/90 text-sm mb-1">Want to trade?</div>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-white text-[#001D8D] border-white hover:bg-gray-100 font-bold"
                    onClick={() => {
                      // Navigate to exchange page
                      window.location.href = '/exchange';
                    }}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Start Exchange
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  );
}