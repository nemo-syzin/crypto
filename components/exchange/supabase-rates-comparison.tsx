"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getAllRates, type AllRates } from '@/lib/supabase/rates';
import { TrendingUp, RefreshCw, AlertTriangle, Database, ExternalLink, CheckCircle } from 'lucide-react';

export function SupabaseRatesComparison() {
  const [rates, setRates] = useState<AllRates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const ratesData = await getAllRates();
      setRates(ratesData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    
    // Автоматическое обновление каждые 30 секунд
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRateComparison = () => {
    if (!rates) return [];

    return [
      {
        name: 'KenigSwap',
        sell: rates.kenig.sell,
        buy: rates.kenig.buy,
        color: 'blue',
        available: rates.kenig.sell !== null
      },
      {
        name: 'BestChange',
        sell: rates.bestchange.sell,
        buy: rates.bestchange.buy,
        color: 'green',
        available: rates.bestchange.sell !== null
      },
      {
        name: 'EnergoTransBank',
        sell: rates.energo.sell,
        buy: rates.energo.buy,
        color: 'purple',
        available: rates.energo.sell !== null
      }
    ];
  };

  const getBestRate = () => {
    const comparison = getRateComparison();
    const availableRates = comparison.filter(item => item.available && item.sell);
    
    if (availableRates.length === 0) return null;
    
    return availableRates.reduce((best, current) => 
      (current.sell! > best.sell!) ? current : best
    );
  };

  const rateComparison = getRateComparison();
  const bestRate = getBestRate();

  return (
    <div className="space-y-6">
      {/* Database Status Alert */}
      {rates && !rates.isFromDatabase && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Используются демонстрационные данные</strong>
            <br />
            {rates.error}
            <br />
            <div className="mt-2 flex items-center gap-2">
              <span>Для решения проблемы:</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('/debug-supabase', '_blank')}
                className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Диагностика
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {rates && rates.isFromDatabase && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Курсы загружены из Supabase</strong>
            <br />
            Данные обновляются автоматически каждые 30 секунд
          </AlertDescription>
        </Alert>
      )}

      {/* Rates Comparison */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-[#001D8D]/10 hover:border-[#001D8D]/30 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-[#001D8D] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Сравнение курсов из Supabase
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRates}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rateComparison.map((source) => (
            <div
              key={source.name}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                bestRate?.name === source.name
                  ? 'border-green-300 bg-green-50'
                  : source.available
                  ? 'border-gray-200 bg-gray-50'
                  : 'border-gray-100 bg-gray-25 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold ${
                    source.color === 'blue' ? 'text-blue-900' :
                    source.color === 'green' ? 'text-green-900' :
                    'text-purple-900'
                  }`}>
                    {source.name}
                  </h3>
                  {bestRate?.name === source.name && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Лучший курс
                    </span>
                  )}
                  {!source.available && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      Недоступно
                    </span>
                  )}
                </div>
                <Database className={`h-4 w-4 ${
                  rates?.isFromDatabase ? 'text-green-600' : 'text-yellow-600'
                }`} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${
                    source.color === 'blue' ? 'text-blue-700' :
                    source.color === 'green' ? 'text-green-700' :
                    'text-purple-700'
                  }`}>
                    Продажа USDT
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {source.sell ? `${source.sell} ₽` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${
                    source.color === 'blue' ? 'text-blue-700' :
                    source.color === 'green' ? 'text-green-700' :
                    'text-purple-700'
                  }`}>
                    Покупка USDT
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {source.buy ? `${source.buy} ₽` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {lastUpdated && (
            <div className="text-xs text-gray-500 text-center border-t pt-3">
              Последнее обновление: {lastUpdated.toLocaleTimeString('ru-RU')}
              {rates?.isFromDatabase ? ' (из Supabase)' : ' (демо данные)'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}