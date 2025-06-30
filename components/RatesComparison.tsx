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
  ChevronDown,
  Info
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
        setCountdown(`${diff}с`);
      } else if (diff < 3600) {
        setCountdown(`${Math.floor(diff / 60)}м`);
      } else {
        setCountdown(`${Math.floor(diff / 3600)}ч`);
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

  // Mock sparkline data
  const generateSparklineData = (baseRate: number | null): number[] => {
    if (!baseRate) return [];
    const data = [];
    for (let i = 0; i < 6; i++) {
      const variation = (Math.random() - 0.5) * 0.015;
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
      description: 'Основной',
      priority: 1
    },
    {
      name: 'BestChange',
      sellRate: rates.bestchange.sell,
      buyRate: rates.bestchange.buy,
      updatedAt: rates.bestchange.updated_at,
      available: rates.bestchange.sell !== null && !isNaN(rates.bestchange.sell!),
      description: 'Агрегатор',
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

  const renderCompactRateCard = (exchange: any, type: 'sell' | 'buy', isBest: boolean) => {
    const rate = type === 'sell' ? exchange.sellRate : exchange.buyRate;
    const kenigRate = type === 'sell' ? rates?.kenig.sell : rates?.kenig.buy;
    const delta = calculateDelta(rate, kenigRate);
    const sparklineData = generateSparklineData(rate);
    const sparklineColor = delta.isPositive ? '#10b981' : '#6b7280';

    return (
      <div
        key={`${type}-${exchange.name}`}
        className={`glass-tile p-4 transition-all duration-200 ${
          !exchange.available
            ? 'opacity-60'
            : isBest
            ? 'ring-2 ring-green-500'
            : ''
        }`}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-base font-semibold text-[#001D8D]">
              {exchange.name}
            </h4>
            <p className="text-xs text-muted/60">
              {exchange.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {sparklineData.length > 0 && (
              <TinySparkline 
                data={sparklineData} 
                color={sparklineColor}
                width={24}
                height={6}
              />
            )}
          </div>
        </div>

        {/* Rate and Delta */}
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-[#001D8D]">
            {formatRate(rate)}
          </div>
          <div className="text-right">
            {exchange.name !== 'KenigSwap' ? (
              <div className={`text-xs ${delta.color}`}>
                {delta.isPositive ? '+' : '−'}{delta.delta.toFixed(2)}%
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                базовый
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Configuration Error Alert */}
      {isConfigurationError && (
        <Alert className="bg-orange-50 border-orange-200">
          <Settings className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Требуется настройка:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Other Errors Alert */}
      {error && !isConfigurationError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Ошибка:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Comparison Card - Compact */}
      <Card className="glass-tile border-none shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#001D8D] flex items-center gap-2 text-lg">
              <TrendingUp className="h-4 w-4" />
              Сравнение курсов
            </CardTitle>
            
            {/* Compact refresh section */}
            <div className="flex items-center gap-2">
              <div className="countdown-timer text-xs">
                {countdown}
              </div>
              <button
                onClick={refetch}
                disabled={loading}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#001D8D]/10 hover:bg-[#001D8D]/20 transition-colors"
              >
                <RefreshCw className={`h-3 w-3 text-[#001D8D] ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-[#001D8D]">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Загрузка актуальных курсов...</span>
              </div>
            </div>
          ) : rates ? (
            <div className="space-y-6">
              {/* Sell Rates Section - Compact */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRightLeft className="h-4 w-4 text-red-500" />
                  <h3 className="text-base font-semibold">Продажа USDT → RUB</h3>
                  <span className="text-xs text-muted/60">(лучший = низкий)</span>
                </div>

                {/* Desktop view - Compact grid */}
                <div className="hidden sm:grid grid-cols-2 gap-4">
                  {exchangeData.map((exchange) => 
                    renderCompactRateCard(exchange, 'sell', bestSell?.source === exchange.name)
                  )}
                </div>

                {/* Mobile view - Simplified */}
                <div className="sm:hidden">
                  {mobileLeader && renderCompactRateCard(mobileLeader, 'sell', bestSell?.source === mobileLeader.name)}
                  
                  {exchangeData.length > 1 && (
                    <details className="mt-3">
                      <summary className="flex items-center gap-2 cursor-pointer text-sm text-[#001D8D] hover:text-[#001D8D]/80">
                        <span>Ещё {exchangeData.length - 1}</span>
                        <ChevronDown className="h-3 w-3" />
                      </summary>
                      <div className="mt-3 space-y-3">
                        {exchangeData.filter(ex => ex.name !== mobileLeader.name).map((exchange) => 
                          renderCompactRateCard(exchange, 'sell', bestSell?.source === exchange.name)
                        )}
                      </div>
                    </details>
                  )}
                </div>
              </div>

              {/* Buy Rates Section - Compact */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                  <h3 className="text-base font-semibold">Покупка USDT ← RUB</h3>
                  <span className="text-xs text-muted/60">(лучший = высокий)</span>
                </div>

                {/* Desktop view - Compact grid */}
                <div className="hidden sm:grid grid-cols-2 gap-4">
                  {exchangeData.map((exchange) => 
                    renderCompactRateCard(exchange, 'buy', bestBuy?.source === exchange.name)
                  )}
                </div>

                {/* Mobile view - Simplified */}
                <div className="sm:hidden">
                  {mobileLeader && renderCompactRateCard(mobileLeader, 'buy', bestBuy?.source === mobileLeader.name)}
                  
                  {exchangeData.length > 1 && (
                    <details className="mt-3">
                      <summary className="flex items-center gap-2 cursor-pointer text-sm text-[#001D8D] hover:text-[#001D8D]/80">
                        <span>Ещё {exchangeData.length - 1}</span>
                        <ChevronDown className="h-3 w-3" />
                      </summary>
                      <div className="mt-3 space-y-3">
                        {exchangeData.filter(ex => ex.name !== mobileLeader.name).map((exchange) => 
                          renderCompactRateCard(exchange, 'buy', bestBuy?.source === exchange.name)
                        )}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[#001D8D]/70">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm">Нет данных о курсах</p>
            </div>
          )}
        </CardContent>

        {/* Updated Transparency Note */}
        <div className="border-t border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 px-6 py-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Info className="h-4 w-4 text-[#001D8D]/70" />
            </div>
            <div className="text-sm text-[#001D8D]/80 leading-relaxed">
              <strong className="text-[#001D8D]">Актуальные курсы:</strong> данные обновляются каждые 30 секунд из нашей базы данных для обеспечения точности и актуальности.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}