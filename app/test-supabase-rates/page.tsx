"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupabaseRates, type KenigRatesData, type RatesData } from '@/lib/supabase/rates';
import { Database, RefreshCw, Plus, History } from 'lucide-react';
import SupabaseExchangeCalculator from '@/components/ExchangeCalculator';

export default function TestSupabaseRatesPage() {
  const [rates, setRates] = useState<RatesData | null>(null);
  const [currentRates, setCurrentRates] = useState<KenigRatesData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newRate, setNewRate] = useState({
    sellRate: 93.5,
    buyRate: 92.0
  });

  const { getCurrentRates, getLatestRates, updateRates, testConnection, subscribeRates } = useSupabaseRates();

  const loadRates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [current, latest] = await Promise.all([
        getCurrentRates(),
        getLatestRates()
      ]);
      setCurrentRates(current);
      setRates(latest);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки курсов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRate = async () => {
    setIsLoading(true);
    try {
      const success = await updateRates(newRate.sellRate, newRate.buyRate);
      
      if (success) {
        await loadRates();
      } else {
        setError('Не удалось обновить курс');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRates();

    // Подписка на realtime изменения
    const subscription = subscribeRates((newRates) => {
      console.log('🔄 Realtime update received:', newRates);
      setCurrentRates(newRates);
      // Обновляем также общие данные
      loadRates();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#001D8D] flex items-center gap-2">
                <Database className="h-6 w-6" />
                Тестирование таблицы kenig_rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={loadRates} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Обновить курсы
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#001D8D]">
                  Калькулятор с kenig_rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SupabaseExchangeCalculator />
              </CardContent>
            </Card>

            {/* Update Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#001D8D]">
                  Обновить курс kenig_rates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sellRate">Курс продажи USDT</Label>
                  <Input
                    id="sellRate"
                    type="number"
                    step="0.01"
                    value={newRate.sellRate}
                    onChange={(e) => setNewRate({...newRate, sellRate: parseFloat(e.target.value)})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="buyRate">Курс покупки USDT</Label>
                  <Input
                    id="buyRate"
                    type="number"
                    step="0.01"
                    value={newRate.buyRate}
                    onChange={(e) => setNewRate({...newRate, buyRate: parseFloat(e.target.value)})}
                  />
                </div>
                
                <Button onClick={handleUpdateRate} disabled={isLoading} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Обновить курс в kenig_rates
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Current Rates Display */}
          {currentRates && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#001D8D]">
                  Текущие курсы из kenig_rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Продажа USDT</h3>
                    <p className="text-2xl font-bold text-blue-700">{currentRates.sell} ₽</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900">Покупка USDT</h3>
                    <p className="text-2xl font-bold text-green-700">{currentRates.buy} ₽</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-900">Последнее обновление</h3>
                    <p className="text-sm text-purple-700">
                      {new Date(currentRates.ts).toLocaleString('ru-RU')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Information */}
          {rates && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#001D8D]">
                  Статус подключения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Источник данных:</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      rates.isFromDatabase 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rates.isFromDatabase ? 'Supabase kenig_rates' : 'Демо данные'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Последнее обновление:</span>
                    <span className="text-gray-700">
                      {new Date(rates.timestamp).toLocaleString('ru-RU')}
                    </span>
                  </div>

                  {rates.error && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <span className="font-medium text-red-800">Ошибка:</span>
                      <p className="text-red-700 mt-1">{rates.error}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#001D8D]">
                Инструкции по настройке kenig_rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="text-yellow-400">-- Создание таблицы kenig_rates в Supabase</div>
                  <div>CREATE TABLE kenig_rates (</div>
                  <div>&nbsp;&nbsp;id SERIAL PRIMARY KEY,</div>
                  <div>&nbsp;&nbsp;usdt_sell_rate DECIMAL(10,4) NOT NULL,</div>
                  <div>&nbsp;&nbsp;usdt_buy_rate DECIMAL(10,4) NOT NULL,</div>
                  <div>&nbsp;&nbsp;updated_at TIMESTAMPTZ DEFAULT NOW()</div>
                  <div>);</div>
                  <br />
                  <div className="text-yellow-400">-- Вставка начальных данных</div>
                  <div>INSERT INTO kenig_rates (id, usdt_sell_rate, usdt_buy_rate) VALUES (1, 93.5, 92.0);</div>
                  <br />
                  <div className="text-yellow-400">-- Включение Row Level Security</div>
                  <div>ALTER TABLE kenig_rates ENABLE ROW LEVEL SECURITY;</div>
                  <br />
                  <div className="text-yellow-400">-- Политика для чтения (публичный доступ)</div>
                  <div>CREATE POLICY "Anyone can read kenig_rates"</div>
                  <div>&nbsp;&nbsp;ON kenig_rates FOR SELECT TO public USING (true);</div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-blue-800">
                    <strong>Важно:</strong> После создания таблицы обновите страницу и нажмите "Обновить курсы" 
                    для проверки подключения к новой таблице kenig_rates.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}