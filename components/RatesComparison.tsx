"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TinySparkline } from '@/components/ui/tiny-sparkline';
import { useAllRates } from '@/lib/hooks/rates';
import { 
  TrendingUp, 
  RefreshCw, 
  AlertTriangle, 
  Settings, 
  ArrowRightLeft, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function RatesComparison() {
  const { rates, loading, error, lastUpdated, refetch } = useAllRates();
  const [countdown, setCountdown] = useState<string>('');
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (!lastUpdated) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
      
      if (diff < 60) {
        setCountdown(`${diff} с назад`);
      } else if (diff < 3600) {
        setCountdown(`${Math.floor(diff / 60)} мин назад`);
      } else {
        setCountdown(`${Math.floor(diff / 3600)} ч назад`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const formatRate = (rate: number | null): string => {
    if (rate === null || rate === undefined || isNaN(rate)) return '—';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate);
  };

  const formatRelativeTime = (dateString?: string): string => {
    if (!dateString) return 'недавно';
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ru });
    } catch {
      return 'недавно';
    }
  };

  // Calculate delta vs KenigSwap
  const calculateDelta = (rate: number | null, kenigRate: number | null): { 
    delta: number; 
    isPositive: boolean; 
    color: string 
  } => {
    if (!rate || !kenigRate || isNaN(rate) || isNaN(kenigRate)) {
      return { delta: 0, isPositive: false, color: 'text-gray-400' };
    }
    
    const delta = ((rate - kenigRate) / kenigRate) * 100;
    const isPositive = delta > 0;
    const color = isPositive ? 'text-green-600' : 'text-gray-400';
    
    return { delta: Math.abs(delta), isPositive, color };
  };

  // Mock sparkline data (в реальном приложении это будут исторические данные)
  const generateSparklineData = (baseRate: number | null): number[] => {
    if (!baseRate) return [];
    const data = [];
    for (let i = 0; i < 8; i++) {
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      data.push(baseRate * (1 + variation));
    }
    return data;
  };

  // Логика для определения лучших курсов
  const getBestSellRate = () => {
    if (!rates) return null;
    const sellRates = [
      { source: 'KenigSwap', rate: rates.kenig.sell },
      { source: 'BestChange', rate: rates.bestchange.sell },
    ].filter(item => item.rate !== null && !isNaN(item.rate!)) as { source: string; rate: number }[];
    
    if (sellRates.length === 0) return null;
    return sellRates.reduce((best, current) => 
      current.rate < best.rate ? current : best
    );
  };

  const getBestBuyRate = () => {
    if (!rates) return null;
    const buyRates = [
      { source: 'KenigSwap', rate: rates.kenig.buy },
      { source: 'BestChange', rate: rates.bestchange.buy },
    ].filter(item => item.rate !== null && !isNaN(item.rate!)) as { source: string; rate: number }[];
    
    if (buyRates.length === 0) return null;
    return buyRates.reduce((best, current) => 
      current.rate > best.rate ? current : best
    );
  };

  const bestSell = getBestSellRate();
  const bestBuy = getBestBuyRate();

  const exchangeData = rates ? [
    {
      name: 'KenigSwap',
      sellRate: rates.kenig.sell,
      buyRate: rates.kenig.buy,
      updatedAt: rates.kenig.updated_at,
      available: rates.kenig.sell !== null && !isNaN(rates.kenig.sell!),
      description: 'Основной обменник',
      priority: 1
    },
    {
      name: 'BestChange',
      sellRate: rates.bestchange.sell,
      buyRate: rates.bestchange.buy,
      updatedAt: rates.bestchange.updated_at,
      available: rates.bestchange.sell !== null && !isNaN(rates.bestchange.sell!),
      description: 'Агрегатор обменников',
      priority: 2
    }
  ] : [];

  // Check if error is configuration related
  const isConfigurationError = error && (
    error.includes('not configured') || 
    error.includes('Invalid API key') || 
    error.includes('environment variables')
  );

  // Mobile: show only leader
  const mobileLeader = exchangeData.find(ex => 
    (bestSell?.source === ex.name || bestBuy?.source === ex.name) && ex.available
  ) || exchangeData[0];

  const renderRateCard = (exchange: any, type: 'sell' | 'buy', isBest: boolean) => {
    const rate = type === 'sell' ? exchange.sellRate : exchange.buyRate;
    const kenigRate = type === 'sell' ? rates?.kenig.sell : rates?.kenig.buy;
    const delta = calculateDelta(rate, kenigRate);
    const sparklineData = generateSparklineData(rate);
    const sparklineColor = delta.isPositive ? '#10b981' : '#6b7280';

    return (
      <div
        key={`${type}-${exchange.name}`}
        className={`glass-tile p-6 transition-all duration-200 ${
          !exchange.available
            ? 'opacity-60'
            : isBest
            ? 'ring-2 ring-green-500'
            : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-[#001D8D]">
              {exchange.name}
            </h4>
            <p className="text-xs text-muted/70">
              {exchange.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {isBest && exchange.available && (
              <span className="badge-outline badge-success">
                Лучший
              </span>
            )}
            {!exchange.available && (
              <span className="badge-outline badge-neutral">
                Недоступно
              </span>
            )}
          </div>
        </div>

        {/* Rate and Sparkline */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-3xl font-bold text-[#001D8D]">
            {formatRate(rate)}
          </div>
          {sparklineData.length > 0 && (
            <TinySparkline 
              data={sparklineData} 
              color={sparklineColor}
              width={30}
              height={8}
            />
          )}
        </div>

        {/* Delta indicator */}
        {exchange.name !== 'KenigSwap' && (
          <div className={`text-xs mb-2 ${delta.color}`}>
            {delta.isPositive ? '+' : '−'}{delta.delta.toFixed(2)}%
          </div>
        )}
        {exchange.name === 'KenigSwap' && (
          <div className="text-xs mb-2 text-gray-400">
            базовый курс
          </div>
        )}

        {/* Updated time */}
        <div className="text-xs text-muted/70">
          обновлено {formatRelativeTime(exchange.updatedAt)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Configuration Error Alert */}
      {isConfigurationError && (
        <Alert className="bg-orange-50 border-orange-200">
          <Settings className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Требуется настройка:</strong>
            <br />
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Other Errors Alert */}
      {error && !isConfigurationError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Ошибка загрузки курсов:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Comparison Card */}
      <Card className="glass-tile border-none shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#001D8D] flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Сравнение курсов обмена
            </CardTitle>
            
            {/* Refresh button with countdown */}
            <div className="flex items-center gap-3">
              <div className="countdown-timer">
                Обновлено {countdown}
              </div>
              <button
                onClick={refetch}
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#001D8D]/10 hover:bg-[#001D8D]/20 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 text-[#001D8D] ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-[#001D8D]">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span className="font-medium">Загрузка курсов...</span>
              </div>
            </div>
          ) : rates ? (
            <div className="space-y-8">
              {/* Sell Rates Section */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
                  <ArrowRightLeft className="h-4 w-4 text-red-500" />
                  Продажа USDT → RUB
                </h3>
                <p className="text-xs text-muted/70 mb-6">
                  (лучший курс = самый низкий)
                  <button className="ml-2 text-[#001D8D]/50 hover:text-[#001D8D]">
                    <Info className="h-3 w-3 inline" />
                  </button>
                </p>

                {/* Desktop view */}
                <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exchangeData.map((exchange) => 
                    renderRateCard(exchange, 'sell', bestSell?.source === exchange.name)
                  )}
                </div>

                {/* Mobile view */}
                <div className="sm:hidden">
                  {mobileLeader && renderRateCard(mobileLeader, 'sell', bestSell?.source === mobileLeader.name)}
                  
                  {exchangeData.length > 1 && (
                    <details className="mt-4">
                      <summary className="flex items-center gap-2 cursor-pointer text-sm text-[#001D8D] hover:text-[#001D8D]/80">
                        <span>Показать ещё {exchangeData.length - 1} источников</span>
                        <ChevronDown className="h-4 w-4" />
                      </summary>
                      <div className="mt-4 space-y-4">
                        {exchangeData.filter(ex => ex.name !== mobileLeader.name).map((exchange) => 
                          renderRateCard(exchange, 'sell', bestSell?.source === exchange.name)
                        )}
                      </div>
                    </details>
                  )}
                </div>
              </div>

              {/* Buy Rates Section */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
                  <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                  Покупка USDT ← RUB
                </h3>
                <p className="text-xs text-muted/70 mb-6">
                  (лучший курс = самый высокий)
                  <button className="ml-2 text-[#001D8D]/50 hover:text-[#001D8D]">
                    <Info className="h-3 w-3 inline" />
                  </button>
                </p>

                {/* Desktop view */}
                <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exchangeData.map((exchange) => 
                    renderRateCard(exchange, 'buy', bestBuy?.source === exchange.name)
                  )}
                </div>

                {/* Mobile view */}
                <div className="sm:hidden">
                  {mobileLeader && renderRateCard(mobileLeader, 'buy', bestBuy?.source === mobileLeader.name)}
                  
                  {exchangeData.length > 1 && (
                    <details className="mt-4">
                      <summary className="flex items-center gap-2 cursor-pointer text-sm text-[#001D8D] hover:text-[#001D8D]/80">
                        <span>Показать ещё {exchangeData.length - 1} источников</span>
                        <ChevronDown className="h-4 w-4" />
                      </summary>
                      <div className="mt-4 space-y-4">
                        {exchangeData.filter(ex => ex.name !== mobileLeader.name).map((exchange) => 
                          renderRateCard(exchange, 'buy', bestBuy?.source === exchange.name)
                        )}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[#001D8D]/70">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-lg font-medium">Нет данных для отображения</p>
              <p className="text-sm mt-2">Проверьте подключение к базе данных</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}