"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAllRates } from '@/lib/hooks/rates';
import { TrendingUp, RefreshCw, Crown, AlertTriangle, Clock, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function RatesComparison() {
  const { rates, loading, error, lastUpdated, refetch } = useAllRates();

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

  // Логика для определения лучших курсов (только KenigSwap и BestChange)
  const getBestSellRate = () => {
    if (!rates) return null;
    const sellRates = [
      { source: 'KenigSwap', rate: rates.kenig.sell },
      { source: 'BestChange', rate: rates.bestchange.sell },
    ].filter(item => item.rate !== null && !isNaN(item.rate!)) as { source: string; rate: number }[];
    
    if (sellRates.length === 0) return null;
    // Лучший курс продажи = самый НИЗКИЙ (выгоднее для клиента)
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
    // Лучший курс покупки = самый ВЫСОКИЙ (выгоднее для клиента)
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
      color: 'blue',
      available: rates.kenig.sell !== null && !isNaN(rates.kenig.sell!),
      description: 'Основной обменник',
      isCompetitive: true
    },
    {
      name: 'BestChange',
      sellRate: rates.bestchange.sell,
      buyRate: rates.bestchange.buy,
      updatedAt: rates.bestchange.updated_at,
      color: 'green',
      available: rates.bestchange.sell !== null && !isNaN(rates.bestchange.sell!),
      description: 'Агрегатор обменников',
      isCompetitive: true
    },
    {
      name: 'EnergoTransBank',
      sellRate: rates.energo.sell,
      buyRate: rates.energo.buy,
      updatedAt: rates.energo.updated_at,
      color: 'purple',
      available: rates.energo.sell !== null && !isNaN(rates.energo.sell!),
      description: 'Справочно: курсы доллара',
      isCompetitive: false
    },
  ] : [];

  // Check if error is configuration related
  const isConfigurationError = error && (
    error.includes('not configured') || 
    error.includes('Invalid API key') || 
    error.includes('environment variables')
  );

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
            <br />
            <span className="text-sm mt-2 block">
              Проверьте файл .env.local и убедитесь, что указаны правильные значения для NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY
            </span>
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
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#001D8D] flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Сравнение курсов обмена
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="text-[#001D8D] border-[#001D8D]/20 hover:bg-[#001D8D]/5"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-[#001D8D]/70">
              <Clock className="h-4 w-4" />
              Последнее обновление: {lastUpdated.toLocaleTimeString('ru-RU')}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2 text-[#001D8D]">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Загрузка курсов...</span>
              </div>
            </div>
          ) : rates ? (
            <div className="space-y-8">
              {/* Sell Rates Section */}
              <div>
                <h3 className="text-lg font-semibold text-[#001D8D] mb-4">
                  Продажа USDT → RUB
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exchangeData.map((exchange) => (
                    <div
                      key={`sell-${exchange.name}`}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        !exchange.available
                          ? 'border-gray-100 bg-gray-25 opacity-60'
                          : !exchange.isCompetitive
                          ? 'border-purple-200 bg-purple-50'
                          : bestSell?.source === exchange.name
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-[#001D8D]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className={`font-semibold ${
                            exchange.color === 'blue' ? 'text-blue-900' :
                            exchange.color === 'green' ? 'text-green-900' :
                            'text-purple-900'
                          }`}>
                            {exchange.name}
                          </h4>
                          <p className="text-xs text-gray-500">{exchange.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {bestSell?.source === exchange.name && exchange.available && exchange.isCompetitive && (
                            <Badge className="bg-green-500 text-white">
                              <Crown className="h-3 w-3 mr-1" />
                              Лучший
                            </Badge>
                          )}
                          {!exchange.isCompetitive && (
                            <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                              Справочно
                            </Badge>
                          )}
                          {!exchange.available && (
                            <Badge variant="outline" className="text-xs text-gray-500">
                              Недоступно
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-2xl font-bold text-[#001D8D] mb-2">
                        {formatRate(exchange.sellRate)}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {exchange.available ? formatRelativeTime(exchange.updatedAt) : 'Нет данных'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buy Rates Section */}
              <div>
                <h3 className="text-lg font-semibold text-[#001D8D] mb-4">
                  Покупка USDT ← RUB
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exchangeData.map((exchange) => (
                    <div
                      key={`buy-${exchange.name}`}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        !exchange.available
                          ? 'border-gray-100 bg-gray-25 opacity-60'
                          : !exchange.isCompetitive
                          ? 'border-purple-200 bg-purple-50'
                          : bestBuy?.source === exchange.name
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-[#001D8D]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className={`font-semibold ${
                            exchange.color === 'blue' ? 'text-blue-900' :
                            exchange.color === 'green' ? 'text-green-900' :
                            'text-purple-900'
                          }`}>
                            {exchange.name}
                          </h4>
                          <p className="text-xs text-gray-500">{exchange.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {bestBuy?.source === exchange.name && exchange.available && exchange.isCompetitive && (
                            <Badge className="bg-green-500 text-white">
                              <Crown className="h-3 w-3 mr-1" />
                              Лучший
                            </Badge>
                          )}
                          {!exchange.isCompetitive && (
                            <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                              Справочно
                            </Badge>
                          )}
                          {!exchange.available && (
                            <Badge variant="outline" className="text-xs text-gray-500">
                              Недоступно
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-2xl font-bold text-[#001D8D] mb-2">
                        {formatRate(exchange.buyRate)}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {exchange.available ? formatRelativeTime(exchange.updatedAt) : 'Нет данных'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary - только для KenigSwap и BestChange */}
              {(bestSell || bestBuy) && (
                <div className="bg-[#001D8D]/5 rounded-lg p-4">
                  <h4 className="font-semibold text-[#001D8D] mb-2">
                    Лучшие курсы сейчас
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#001D8D]/70">Лучшая продажа USDT:</span>
                      <div className="font-medium text-[#001D8D]">
                        {bestSell ? `${formatRate(bestSell.rate)} (${bestSell.source})` : '—'}
                      </div>
                    </div>
                    <div>
                      <span className="text-[#001D8D]/70">Лучшая покупка USDT:</span>
                      <div className="font-medium text-[#001D8D]">
                        {bestBuy ? `${formatRate(bestBuy.rate)} (${bestBuy.source})` : '—'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-[#001D8D]/60">
                    * EnergoTransBank показан справочно и не участвует в сравнении
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-[#001D8D]/70">
              Нет данных для отображения
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}