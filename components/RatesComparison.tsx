"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAllRates } from '@/lib/hooks/rates';
import { TrendingUp, RefreshCw, Crown, AlertTriangle, Clock, Settings, Star, Award } from 'lucide-react';
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
      color: '#3b82f6',
      available: rates.kenig.sell !== null && !isNaN(rates.kenig.sell!),
      description: 'Основной обменник',
      isCompetitive: true,
      priority: 1
    },
    {
      name: 'BestChange',
      sellRate: rates.bestchange.sell,
      buyRate: rates.bestchange.buy,
      updatedAt: rates.bestchange.updated_at,
      color: '#10b981',
      available: rates.bestchange.sell !== null && !isNaN(rates.bestchange.sell!),
      description: 'Агрегатор обменников',
      isCompetitive: true,
      priority: 2
    },
    {
      name: 'EnergoTransBank',
      sellRate: rates.energo.sell,
      buyRate: rates.energo.buy,
      updatedAt: rates.energo.updated_at,
      color: '#8b5cf6',
      available: rates.energo.sell !== null && !isNaN(rates.energo.sell!),
      description: 'Справочно: курсы доллара',
      isCompetitive: false,
      priority: 3
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
        <div className="error-toast">
          <Settings className="h-4 w-4 mr-2 inline" />
          <strong>Требуется настройка:</strong>
          <br />
          {error}
          <br />
          <span className="text-sm mt-2 block">
            Проверьте файл .env.local и убедитесь, что указаны правильные значения для NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY
          </span>
        </div>
      )}

      {/* Other Errors Alert */}
      {error && !isConfigurationError && (
        <div className="error-toast">
          <AlertTriangle className="h-4 w-4 mr-2 inline" />
          <strong>Ошибка загрузки курсов:</strong> {error}
        </div>
      )}

      {/* Main Comparison Card */}
      <div className="calculator-container">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-[#001D8D] text-xl font-bold">
                Сравнение курсов обмена
              </span>
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="refresh-button"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {lastUpdated && (
                <span className="timestamp">
                  {lastUpdated.toLocaleTimeString('ru-RU')}
                </span>
              )}
            </button>
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
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-[#001D8D]">
                    Продажа USDT → RUB
                  </h3>
                  <div className="hint-text ml-2">
                    (лучший курс = самый низкий)
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exchangeData.map((exchange) => (
                    <div
                      key={`sell-${exchange.name}`}
                      className={`relative p-6 rounded-xl transition-all duration-300 ${
                        !exchange.available
                          ? 'bg-gray-50 border border-gray-200 opacity-60'
                          : !exchange.isCompetitive
                          ? 'bg-purple-50 border border-purple-200'
                          : bestSell?.source === exchange.name
                          ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 shadow-lg scale-105'
                          : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      {/* Best Rate Crown */}
                      {bestSell?.source === exchange.name && exchange.available && exchange.isCompetitive && (
                        <div className="absolute -top-3 -right-3">
                          <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                            <Crown className="h-4 w-4" />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-[#001D8D] text-lg">
                            {exchange.name}
                          </h4>
                          <p className="text-sm text-[#001D8D]/60">{exchange.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {bestSell?.source === exchange.name && exchange.available && exchange.isCompetitive && (
                            <Badge className="bg-green-500 text-white border-0 text-xs">
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
                      
                      <div className="text-2xl font-bold text-[#001D8D] mb-3">
                        {formatRate(exchange.sellRate)}
                      </div>
                      
                      <div className="text-xs text-[#001D8D]/50">
                        {exchange.available ? formatRelativeTime(exchange.updatedAt) : 'Нет данных'}
                      </div>

                      {/* Priority indicator */}
                      <div className="absolute bottom-2 left-2">
                        <div className="flex gap-1">
                          {Array.from({ length: 4 - exchange.priority }, (_, i) => (
                            <div 
                              key={i} 
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: exchange.color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buy Rates Section */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-bold text-[#001D8D]">
                    Покупка USDT ← RUB
                  </h3>
                  <div className="hint-text ml-2">
                    (лучший курс = самый высокий)
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exchangeData.map((exchange) => (
                    <div
                      key={`buy-${exchange.name}`}
                      className={`relative p-6 rounded-xl transition-all duration-300 ${
                        !exchange.available
                          ? 'bg-gray-50 border border-gray-200 opacity-60'
                          : !exchange.isCompetitive
                          ? 'bg-purple-50 border border-purple-200'
                          : bestBuy?.source === exchange.name
                          ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 shadow-lg scale-105'
                          : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      {/* Best Rate Crown */}
                      {bestBuy?.source === exchange.name && exchange.available && exchange.isCompetitive && (
                        <div className="absolute -top-3 -right-3">
                          <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                            <Crown className="h-4 w-4" />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-[#001D8D] text-lg">
                            {exchange.name}
                          </h4>
                          <p className="text-sm text-[#001D8D]/60">{exchange.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {bestBuy?.source === exchange.name && exchange.available && exchange.isCompetitive && (
                            <Badge className="bg-green-500 text-white border-0 text-xs">
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
                      
                      <div className="text-2xl font-bold text-[#001D8D] mb-3">
                        {formatRate(exchange.buyRate)}
                      </div>
                      
                      <div className="text-xs text-[#001D8D]/50">
                        {exchange.available ? formatRelativeTime(exchange.updatedAt) : 'Нет данных'}
                      </div>

                      {/* Priority indicator */}
                      <div className="absolute bottom-2 left-2">
                        <div className="flex gap-1">
                          {Array.from({ length: 4 - exchange.priority }, (_, i) => (
                            <div 
                              key={i} 
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: exchange.color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary - только для KenigSwap и BestChange */}
              {(bestSell || bestBuy) && (
                <div className="rates-container">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-[#001D8D]" />
                    <h4 className="font-bold text-[#001D8D] text-lg">
                      Лучшие курсы сейчас
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-green-600" />
                        <span className="text-[#001D8D]/70 font-medium">Лучшая продажа USDT:</span>
                      </div>
                      <div className="rate-value text-xl">
                        {bestSell ? `${formatRate(bestSell.rate)} (${bestSell.source})` : '—'}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-blue-600" />
                        <span className="text-[#001D8D]/70 font-medium">Лучшая покупка USDT:</span>
                      </div>
                      <div className="rate-value text-xl">
                        {bestBuy ? `${formatRate(bestBuy.rate)} (${bestBuy.source})` : '—'}
                      </div>
                    </div>
                  </div>
                  <div className="hint-text mt-4 text-center">
                    * EnergoTransBank показан справочно и не участвует в сравнении
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-[#001D8D]/70">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-lg font-medium">Нет данных для отображения</p>
              <p className="text-sm mt-2">Проверьте подключение к базе данных</p>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}