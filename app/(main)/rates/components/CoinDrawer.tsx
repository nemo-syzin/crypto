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

// Функция для проверки и исправления URL изображений
const getSafeImageUrl = (url: string): string => {
  // Заменяем coin-images.coingecko.com на assets.coingecko.com
  if (url && url.includes('coin-images.coingecko.com')) {
    return url.replace('coin-images.coingecko.com', 'assets.coingecko.com');
  }
  return url;
};

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
                  src={getSafeImageUrl(coin.image)} 
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
                <div className="text-white/70 text-sm">Ранг #{coin.market_cap_rank}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-white/90 text-sm">Текущая цена</div>
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
                      Последнее обновление: {new Date(coin.last_updated).toLocaleString('ru-RU')}
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
                        Подробная информация
                      </span>
                    </div>
                    <TabsList className="bg-[#001D8D] border border-[#001D8D]/50">
                      <TabsTrigger value="overview" className="text-white/70 hover:bg-[#001D8D]/80 data-[state=active]:bg-white data-[state=active]:text-[#001D8D]">Обзор</TabsTrigger>
                      <TabsTrigger value="stats" className="text-white/70 hover:bg-[#001D8D]/80 data-[state=active]:bg-white data-[state=active]:text-[#001D8D]">Статистика</TabsTrigger>
                      <TabsTrigger value="analysis" className="text-white/70 hover:bg-[#001D8D]/80 data-[state=active]:bg-white data-[state=active]:text-[#001D8D]">Анализ</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Market Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20 hover:border-[#001D8D]/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-[#001D8D]" />
                          <span className="font-semibold text-[#001D8D]">Рыночная позиция</span>
                        </div>
                        <div className="text-2xl font-bold text-[#001D8D] mb-1">#{coin.market_cap_rank}</div>
                        <div className="text-sm text-[#001D8D]/70">Глобальный рейтинг по капитализации</div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20 hover:border-[#001D8D]/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="h-4 w-4 text-[#001D8D]" />
                          <span className="font-semibold text-[#001D8D]">Капитализация</span>
                        </div>
                        <div className="text-2xl font-bold text-[#001D8D] mb-1">{formatMarketCap(coin.market_cap)}</div>
                        <div className="text-sm text-[#001D8D]/70">Общая рыночная стоимость</div>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20">
                      <h4 className="font-semibold text-[#001D8D] mb-3">Диапазон цен за 24 часа</h4>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-red-600 font-medium">
                          Мин: {formatPrice(coin.low_24h)}
                        </div>
                        <div className="text-green-600 font-medium">
                          Макс: {formatPrice(coin.high_24h)}
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
                      <div className="text-center mt-2 text-sm text-[#001D8D]/70">
                        Текущая: {formatPrice(coin.current_price)}
                      </div>
                    </div>

                    {/* Supply Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20">
                        <div className="text-sm text-[#001D8D]/70 mb-1 font-medium">В обращении</div>
                        <div className="text-xl font-bold text-[#001D8D]">
                          {formatSupply(coin.circulating_supply)}
                        </div>
                        <div className="text-xs text-[#001D8D]/50">{coin.symbol.toUpperCase()}</div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20">
                        <div className="text-sm text-[#001D8D]/70 mb-1 font-medium">Макс. предложение</div>
                        <div className="text-xl font-bold text-[#001D8D]">
                          {coin.max_supply ? formatSupply(coin.max_supply) : 'Неограниченно'}
                        </div>
                        <div className="text-xs text-[#001D8D]/50">
                          {coin.max_supply ? `${((coin.circulating_supply / coin.max_supply) * 100).toFixed(1)}% в обращении` : 'Без максимального лимита'}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="space-y-6">
                    {/* Trading Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20">
                        <div className="text-sm text-[#001D8D]/70 mb-1 font-medium">Объем 24ч</div>
                        <div className="text-xl font-bold text-[#001D8D]">
                          {formatMarketCap(coin.total_volume)}
                        </div>
                        <div className="text-xs text-[#001D8D]/50">Торговая активность</div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20">
                        <div className="text-sm text-[#001D8D]/70 mb-1 font-medium">Объем/Капитализация</div>
                        <div className="text-xl font-bold text-[#001D8D]">
                          {((coin.total_volume / coin.market_cap) * 100).toFixed(2)}%
                        </div>
                        <div className="text-xs text-[#001D8D]/50">Индикатор ликвидности</div>
                      </div>
                    </div>

                    {/* All-Time Records */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-transparent p-4 rounded-lg border-2 border-[#001D8D]/20 hover:border-[#001D8D]/30 transition-colors">
                        <div className="text-sm text-[#001D8D]/70 mb-1 font-medium">Исторический максимум</div>
                        <div className="text-xl font-bold text-green-600 mb-1">
                          {formatPrice(coin.ath)}
                        </div>
                        <div className="text-xs text-[#001D8D]/50">
                          {new Date(coin.ath_date).toLocaleDateString('ru-RU')}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded mt-2 ${
                          (coin.ath_change_percentage || 0) >= 0 ? 'text-green-600 bg-white' : 'text-red-600 bg-white'
                        }`}>
                          {formatPercentage(coin.ath_change_percentage)} от ATH
                        </div>
                      </div>

                      <div className="bg-transparent p-4 rounded-lg border-2 border-[#001D8D]/20 hover:border-[#001D8D]/30 transition-colors">
                        <div className="text-sm text-[#001D8D]/70 mb-1 font-medium">Исторический минимум</div>
                        <div className="text-xl font-bold text-red-600 mb-1">
                          {formatPrice(coin.atl)}
                        </div>
                        <div className="text-xs text-[#001D8D]/50">
                          {new Date(coin.atl_date).toLocaleDateString('ru-RU')}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded mt-2 ${
                          (coin.atl_change_percentage || 0) >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                        }`}>
                          {formatPercentage(coin.atl_change_percentage)} от ATL
                        </div>
                      </div>
                    </div>

                    {/* Price Changes */}
                    <div className="bg-white p-4 rounded-lg border-2 border-[#001D8D]/20">
                      <h4 className="font-semibold text-[#001D8D] mb-3">Динамика цены</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">1 час</div>
                          <div className={`font-bold ${
                            (coin.price_change_percentage_1h_in_currency || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(coin.price_change_percentage_1h_in_currency)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">24 часа</div>
                          <div className={`font-bold ${
                            (coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(coin.price_change_percentage_24h)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">7 дней</div>
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
                    <div className="bg-white p-6 rounded-lg border-2 border-[#001D8D]/20 hover:border-[#001D8D]/30 transition-colors">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="h-5 w-5 text-[#001D8D]" />
                        <h4 className="font-bold text-[#001D8D]">Анализ настроения рынка</h4>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {sentiment.icon}
                          <span className={`font-bold text-lg ${sentiment.color}`}>
                            {sentiment.sentiment}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-[#001D8D]/70">На основе ценовых трендов</div>
                        </div>
                      </div>
                      <div className="text-sm text-[#001D8D]/70">
                        Настроение рынка определяется анализом краткосрочных и долгосрочных движений цены, 
                        показывая общее отношение рынка к данной криптовалюте.
                      </div>
                    </div>

                    {/* Volatility Analysis */}
                    <div className="bg-white p-6 rounded-lg border-2 border-[#001D8D]/20 hover:border-[#001D8D]/30 transition-colors">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-5 w-5 text-[#001D8D]" />
                        <h4 className="font-bold text-[#001D8D]">Оценка волатильности</h4>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className={`font-bold text-lg ${volatility.color}`}>
                            {volatility.level} волатильность
                          </span>
                          <div className="text-sm text-[#001D8D]/70 mt-1">
                            {volatility.description}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#001D8D]">
                            {Math.abs(coin.price_change_percentage_24h || 0).toFixed(1)}%
                          </div>
                          <div className="text-xs text-[#001D8D]/50">Движение за 24ч</div>
                        </div>
                      </div>
                      <div className="text-sm text-[#001D8D]/70">
                        Волатильность измеряет интенсивность колебаний цены. Высокая волатильность указывает 
                        на больший риск, но также и на потенциал более высокой доходности.
                      </div>
                    </div>

                    {/* Trading Insights */}
                    <div className="bg-white p-6 rounded-lg border-2 border-[#001D8D]/20">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-[#001D8D]" />
                        <h4 className="font-bold text-[#001D8D]">Торговая аналитика</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-sm font-medium text-[#001D8D]/70">Ранг по капитализации</span>
                          <span className="font-bold text-[#001D8D]">#{coin.market_cap_rank}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-sm font-medium text-[#001D8D]/70">Полная оценка</span>
                          <span className="font-bold text-[#001D8D]">
                            {coin.fully_diluted_valuation ? formatMarketCap(coin.fully_diluted_valuation) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-sm font-medium text-[#001D8D]/70">Изменение капитализации (24ч)</span>
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
                    <div className="font-bold text-lg">Работает на KenigSwap</div>
                    <div className="text-white/90 text-sm">Профессиональная платформа криптоанализа</div>
                    <div className="text-white/70 text-xs mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Данные обновлены: {new Date(coin.last_updated).toLocaleString('ru-RU')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/90 text-sm mb-1">Хотите торговать?</div>
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
                    Начать обмен
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