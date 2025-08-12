"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, X, Activity, Globe, Info, DollarSign, BarChart3, Clock, Zap, Target } from 'lucide-react';
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
    if (change24h < 2) return { level: 'Низкая', color: 'text-green-600', description: 'Стабильное движение цены' };
    if (change24h < 5) return { level: 'Средняя', color: 'text-yellow-600', description: 'Умеренные колебания' };
    if (change24h < 10) return { level: 'Высокая', color: 'text-orange-600', description: 'Значительная волатильность' };
    return { level: 'Очень высокая', color: 'text-red-600', description: 'Экстремальные движения' };
  };

  // Calculate market sentiment
  const getMarketSentiment = (): { sentiment: string; color: string; icon: React.ReactNode } => {
    const change24h = coin.price_change_percentage_24h || 0;
    const change7d = coin.price_change_percentage_7d_in_currency || 0;
    
    if (change24h > 5 && change7d > 10) {
      return { sentiment: 'Очень бычий', color: 'text-green-700', icon: <TrendingUp className="h-4 w-4" /> };
    } else if (change24h > 0 && change7d > 0) {
      return { sentiment: 'Бычий', color: 'text-green-600', icon: <TrendingUp className="h-4 w-4" /> };
    } else if (change24h < -5 && change7d < -10) {
      return { sentiment: 'Очень медвежий', color: 'text-red-700', icon: <TrendingDown className="h-4 w-4" /> };
    } else if (change24h < 0 && change7d < 0) {
      return { sentiment: 'Медвежий', color: 'text-red-600', icon: <TrendingDown className="h-4 w-4" /> };
    } else {
      return { sentiment: 'Нейтральный', color: 'text-gray-600', icon: <Activity className="h-4 w-4" /> };
    }
  };

  const volatility = getVolatilityLevel();
  const sentiment = getMarketSentiment();

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh] bg-gray-50 border-t border-gray-200">
        {/* Лаконичный заголовок в фирменном стиле */}
        <DrawerHeader className="bg-white border-b border-gray-100 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={getSafeImageUrl(coin.image)} 
                alt={coin.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAVAQEBAQAAAAAAAAAAAAAAAAAAAQID/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              <div>
                <DrawerTitle className="text-[#001D8D] text-xl font-bold">{coin.name}</DrawerTitle>
                <div className="text-[#001D8D]/60 text-sm">{coin.symbol.toUpperCase()} • Ранг #{coin.market_cap_rank}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-[#001D8D]">{formatPrice(coin.current_price)}</div>
                <Badge 
                  variant="outline"
                  className={`mt-1 ${
                    (coin.price_change_percentage_24h || 0) >= 0
                      ? 'border-green-200 text-green-700 bg-white'
                      : 'border-red-200 text-red-700 bg-white'
                  }`}
                >
                  {(coin.price_change_percentage_24h || 0) >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {formatPercentage(coin.price_change_percentage_24h)}
                </Badge>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="text-[#001D8D]/60 hover:text-[#001D8D] hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto">
          {/* Основная информация в стиле калькулятора */}
          <div className="calculator-container mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#001D8D] to-blue-600">
                <Info className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#001D8D]">Детальная информация</h3>
            </div>

            <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'overview' | 'stats' | 'analysis')} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
                <TabsTrigger value="overview" className="text-[#001D8D]/70 data-[state=active]:bg-white data-[state=active]:text-[#001D8D] data-[state=active]:font-semibold">
                  Обзор
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-[#001D8D]/70 data-[state=active]:bg-white data-[state=active]:text-[#001D8D] data-[state=active]:font-semibold">
                  Статистика
                </TabsTrigger>
                <TabsTrigger value="analysis" className="text-[#001D8D]/70 data-[state=active]:bg-white data-[state=active]:text-[#001D8D] data-[state=active]:font-semibold">
                  Анализ
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Ключевые метрики */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-tile p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-[#001D8D]" />
                      <span className="text-sm font-medium text-[#001D8D]/70">Капитализация</span>
                    </div>
                    <div className="text-xl font-bold text-[#001D8D]">{formatMarketCap(coin.market_cap)}</div>
                    <div className="text-xs text-[#001D8D]/50">Ранг #{coin.market_cap_rank}</div>
                  </div>

                  <div className="glass-tile p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-[#001D8D]" />
                      <span className="text-sm font-medium text-[#001D8D]/70">Объем 24ч</span>
                    </div>
                    <div className="text-xl font-bold text-[#001D8D]">{formatMarketCap(coin.total_volume)}</div>
                    <div className="text-xs text-[#001D8D]/50">
                      {((coin.total_volume / coin.market_cap) * 100).toFixed(1)}% от капитализации
                    </div>
                  </div>
                </div>

                {/* Диапазон цен за 24 часа */}
                <div className="glass-tile p-4">
                  <h4 className="font-semibold text-[#001D8D] mb-4 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Диапазон цен за 24 часа
                  </h4>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-red-600 font-medium text-sm">
                      Мин: {formatPrice(coin.low_24h)}
                    </div>
                    <div className="text-green-600 font-medium text-sm">
                      Макс: {formatPrice(coin.high_24h)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 relative mb-2">
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
                  <div className="text-center text-sm text-[#001D8D]/70">
                    Текущая: {formatPrice(coin.current_price)}
                  </div>
                </div>

                {/* Предложение */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-tile p-4">
                    <div className="text-sm text-[#001D8D]/70 mb-1 font-medium">В обращении</div>
                    <div className="text-lg font-bold text-[#001D8D]">
                      {formatSupply(coin.circulating_supply)}
                    </div>
                    <div className="text-xs text-[#001D8D]/50">{coin.symbol.toUpperCase()}</div>
                  </div>

                  <div className="glass-tile p-4">
                    <div className="text-sm text-[#001D8D]/70 mb-1 font-medium">Макс. предложение</div>
                    <div className="text-lg font-bold text-[#001D8D]">
                      {coin.max_supply ? formatSupply(coin.max_supply) : '∞'}
                    </div>
                    <div className="text-xs text-[#001D8D]/50">
                      {coin.max_supply ? `${((coin.circulating_supply / coin.max_supply) * 100).toFixed(1)}% в обращении` : 'Неограниченно'}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-6">
                {/* Исторические рекорды */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-tile p-4">
                    <div className="text-sm text-[#001D8D]/70 mb-2 font-medium">Исторический максимум</div>
                    <div className="text-xl font-bold text-[#001D8D] mb-1">
                      {formatPrice(coin.ath)}
                    </div>
                    <div className="text-xs text-[#001D8D]/50 mb-2">
                      {new Date(coin.ath_date).toLocaleDateString('ru-RU')}
                    </div>
                    <Badge className={`text-xs ${
                      (coin.ath_change_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    } bg-white border-gray-200`}>
                      {formatPercentage(coin.ath_change_percentage)} от ATH
                    </Badge>
                  </div>

                  <div className="glass-tile p-4">
                    <div className="text-sm text-[#001D8D]/70 mb-2 font-medium">Исторический минимум</div>
                    <div className="text-xl font-bold text-[#001D8D] mb-1">
                      {formatPrice(coin.atl)}
                    </div>
                    <div className="text-xs text-[#001D8D]/50 mb-2">
                      {new Date(coin.atl_date).toLocaleDateString('ru-RU')}
                    </div>
                    <Badge className={`text-xs ${
                      (coin.atl_change_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    } bg-white border-gray-200`}>
                      {formatPercentage(coin.atl_change_percentage)} от ATL
                    </Badge>
                  </div>
                </div>

                {/* Динамика цены */}
                <div className="glass-tile p-4">
                  <h4 className="font-semibold text-[#001D8D] mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Динамика цены
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                      <div className="text-xs text-[#001D8D]/60 mb-1">24 часа</div>
                      <div className={`font-bold ${
                        (coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(coin.price_change_percentage_24h)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Дополнительные метрики */}
                <div className="glass-tile p-4">
                  <h4 className="font-semibold text-[#001D8D] mb-4">Дополнительные метрики</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm text-[#001D8D]/70">Полная оценка</span>
                      <span className="font-medium text-[#001D8D]">
                        {coin.fully_diluted_valuation ? formatMarketCap(coin.fully_diluted_valuation) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm text-[#001D8D]/70">Изменение капитализации (24ч)</span>
                      <span className={`font-medium ${
                        (coin.market_cap_change_percentage_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(coin.market_cap_change_percentage_24h)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-[#001D8D]/70">Общее предложение</span>
                      <span className="font-medium text-[#001D8D]">
                        {coin.total_supply ? formatSupply(coin.total_supply) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-6">
                {/* Настроение рынка */}
                <div className="glass-tile p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-[#001D8D]" />
                    <h4 className="font-semibold text-[#001D8D]">Настроение рынка</h4>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {sentiment.icon}
                      <span className={`font-bold text-lg ${sentiment.color}`}>
                        {sentiment.sentiment}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-[#001D8D]/70">
                    Анализ основан на краткосрочных и долгосрочных движениях цены
                  </div>
                </div>

                {/* Волатильность */}
                <div className="glass-tile p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-[#001D8D]" />
                    <h4 className="font-semibold text-[#001D8D]">Волатильность</h4>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className={`font-bold text-lg ${volatility.color}`}>
                        {volatility.level}
                      </span>
                      <div className="text-sm text-[#001D8D]/70 mt-1">
                        {volatility.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#001D8D]">
                        {Math.abs(coin.price_change_percentage_24h || 0).toFixed(1)}%
                      </div>
                      <div className="text-xs text-[#001D8D]/50">За 24 часа</div>
                    </div>
                  </div>
                </div>

                {/* Ликвидность */}
                <div className="glass-tile p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-[#001D8D]" />
                    <h4 className="font-semibold text-[#001D8D]">Ликвидность</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#001D8D]/70">Объем/Капитализация</span>
                      <span className="font-bold text-[#001D8D]">
                        {((coin.total_volume / coin.market_cap) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#001D8D] h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(((coin.total_volume / coin.market_cap) * 100) * 10, 100)}%`
                        }}
                      />
                    </div>
                    <div className="text-xs text-[#001D8D]/60">
                      Высокий коэффициент указывает на активную торговлю
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Футер с призывом к действию */}
          <div className="calculator-container bg-gradient-to-r from-[#001D8D] to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Globe className="h-8 w-8" />
                <div>
                  <div className="font-bold text-lg">KenigSwap</div>
                  <div className="text-white/90 text-sm">Профессиональная криптоплатформа</div>
                  <div className="text-white/70 text-xs mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Обновлено: {new Date(coin.last_updated).toLocaleTimeString('ru-RU')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/90 text-sm mb-2">Начать торговлю</div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-white text-[#001D8D] border-white hover:bg-gray-100 font-semibold"
                  onClick={() => {
                    window.location.href = '/exchange';
                  }}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Обменять {coin.symbol.toUpperCase()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}