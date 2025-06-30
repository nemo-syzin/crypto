"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Globe, Bitcoin, Activity, DollarSign, BarChart3, Users, Zap, Clock } from 'lucide-react';
import { getFearGreedColor, getFearGreedBgColor } from '@/lib/fng';
import type { GlobalMarketData, FearGreedData } from '@/lib/coingecko';

interface GlobalSummaryProps {
  global: GlobalMarketData | null;
  fearGreed: FearGreedData | null;
  loading?: boolean;
}

export function GlobalSummary({ global, fearGreed, loading }: GlobalSummaryProps) {
  const formatMarketCap = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('ru-RU').format(value);
  };

  const fearGreedValue = fearGreed ? parseInt(fearGreed.value) : 50;
  const fearGreedColor = getFearGreedColor(fearGreedValue);
  const fearGreedBg = getFearGreedBgColor(fearGreedValue);

  // Calculate additional metrics
  const getMarketSentiment = () => {
    if (!global) return { text: 'Нейтрально', color: 'text-gray-600' };
    
    const change = global.data.market_cap_change_percentage_24h_usd;
    if (change > 3) return { text: 'Очень бычий', color: 'text-green-700' };
    if (change > 0) return { text: 'Бычий', color: 'text-green-600' };
    if (change < -3) return { text: 'Очень медвежий', color: 'text-red-700' };
    if (change < 0) return { text: 'Медвежий', color: 'text-red-600' };
    return { text: 'Нейтрально', color: 'text-gray-600' };
  };

  const sentiment = getMarketSentiment();

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Main metrics skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="calculator-container animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
        
        {/* Additional metrics skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="calculator-container animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Market Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Market Cap */}
        <div className="calculator-container hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition-transform duration-300">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-[#001D8D]/70">
              Общая капитализация
            </span>
          </div>
          <div className="text-3xl font-bold text-[#001D8D] mb-2">
            {global ? formatMarketCap(global.data.total_market_cap.usd) : 'N/A'}
          </div>
          {global && (
            <div className={`flex items-center gap-1 text-sm ${
              global.data.market_cap_change_percentage_24h_usd >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {global.data.market_cap_change_percentage_24h_usd >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(global.data.market_cap_change_percentage_24h_usd).toFixed(2)}% (24ч)
            </div>
          )}
        </div>

        {/* 24h Volume */}
        <div className="calculator-container hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-[#001D8D]/70">
              Объем торгов (24ч)
            </span>
          </div>
          <div className="text-3xl font-bold text-[#001D8D] mb-2">
            {global ? formatMarketCap(global.data.total_volume.usd) : 'N/A'}
          </div>
          {global && (
            <div className="text-sm text-[#001D8D]/70">
              {((global.data.total_volume.usd / global.data.total_market_cap.usd) * 100).toFixed(1)}% от капитализации
            </div>
          )}
        </div>

        {/* BTC Dominance */}
        <div className="calculator-container hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 group-hover:scale-110 transition-transform duration-300">
              <Bitcoin className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-[#001D8D]/70">
              Доминирование BTC
            </span>
          </div>
          <div className="text-3xl font-bold text-[#001D8D] mb-2">
            {global ? `${global.data.market_cap_percentage.btc.toFixed(1)}%` : 'N/A'}
          </div>
          <div className="text-sm text-[#001D8D]/70">
            ETH: {global ? `${global.data.market_cap_percentage.eth?.toFixed(1) || 'N/A'}%` : 'N/A'}
          </div>
        </div>

        {/* Fear & Greed Index */}
        <div className="calculator-container hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-[#001D8D]/70">
              Индекс страха и жадности
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl font-bold text-[#001D8D]">
              {fearGreed ? fearGreed.value : '50'}
            </div>
            <Badge className={`${fearGreedBg} ${fearGreedColor} border-0 text-xs`}>
              {fearGreed ? fearGreed.value_classification : 'Нейтрально'}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                fearGreedValue <= 25 ? 'bg-red-500' :
                fearGreedValue <= 45 ? 'bg-orange-500' :
                fearGreedValue <= 55 ? 'bg-yellow-500' :
                fearGreedValue <= 75 ? 'bg-green-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${fearGreedValue}%` }}
            />
          </div>
          <div className="text-xs text-[#001D8D]/60">
            Обновляется ежедневно
          </div>
        </div>
      </div>

      {/* Additional Market Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Market Activity */}
        <div className="calculator-container hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-[#001D8D]">Активность рынка</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#001D8D]/70">Активные криптовалюты</span>
              <span className="font-semibold text-[#001D8D]">
                {global ? formatNumber(global.data.active_cryptocurrencies) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#001D8D]/70">Активные биржи</span>
              <span className="font-semibold text-[#001D8D]">
                {global ? formatNumber(global.data.markets) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#001D8D]/70">Завершенные ICO</span>
              <span className="font-semibold text-[#001D8D]">
                {global ? formatNumber(global.data.ended_icos) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="calculator-container hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-[#001D8D]">Настроение рынка</h4>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${sentiment.color} mb-1`}>
                {sentiment.text}
              </div>
              <div className="text-sm text-[#001D8D]/70">
                На основе изменений за 24ч
              </div>
            </div>
            
            {global && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#001D8D]/70">Изменение капитализации</span>
                  <span className={`font-semibold ${
                    global.data.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {global.data.market_cap_change_percentage_24h_usd >= 0 ? '+' : ''}
                    {global.data.market_cap_change_percentage_24h_usd.toFixed(2)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      global.data.market_cap_change_percentage_24h_usd >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min(Math.abs(global.data.market_cap_change_percentage_24h_usd) * 10, 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Market Status */}
        <div className="calculator-container hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-[#001D8D]">Статус рынка</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[#001D8D]">Рынок активен</span>
            </div>
            
            <div className="text-xs text-[#001D8D]/70 space-y-1">
              <div>• Данные обновляются каждые 5 минут</div>
              <div>• Источник: CoinGecko API</div>
              <div>• Покрытие: {global ? formatNumber(global.data.active_cryptocurrencies) : 'N/A'} криптовалют</div>
            </div>

            {global && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-[#001D8D]/60">
                  Последнее обновление: {new Date(global.data.updated_at * 1000).toLocaleString('ru-RU')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Market Analysis Summary */}
      {global && (
        <div className="calculator-container">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-[#001D8D]">Анализ рынка</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {((global.data.total_volume.usd / global.data.total_market_cap.usd) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-blue-800">Коэффициент оборота</div>
              <div className="text-xs text-blue-600 mt-1">Объем/Капитализация</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {global.data.market_cap_percentage.btc.toFixed(0)}%
              </div>
              <div className="text-sm text-green-800">Доминирование BTC</div>
              <div className="text-xs text-green-600 mt-1">Доля рынка</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {formatNumber(global.data.active_cryptocurrencies)}
              </div>
              <div className="text-sm text-purple-800">Активные монеты</div>
              <div className="text-xs text-purple-600 mt-1">В торговле</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {formatNumber(global.data.markets)}
              </div>
              <div className="text-sm text-orange-800">Активные биржи</div>
              <div className="text-xs text-orange-600 mt-1">Торговые площадки</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-blue-900 mb-2">Краткий обзор рынка</h5>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Общая капитализация криптовалютного рынка составляет {formatMarketCap(global.data.total_market_cap.usd)}, 
                  что {global.data.market_cap_change_percentage_24h_usd >= 0 ? 'на' : 'на'} {Math.abs(global.data.market_cap_change_percentage_24h_usd).toFixed(2)}% 
                  {global.data.market_cap_change_percentage_24h_usd >= 0 ? 'выше' : 'ниже'} вчерашнего показателя. 
                  Bitcoin доминирует с долей {global.data.market_cap_percentage.btc.toFixed(1)}%, 
                  а общий объем торгов за 24 часа составляет {formatMarketCap(global.data.total_volume.usd)}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}