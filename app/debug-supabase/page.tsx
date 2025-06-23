"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { checkSupabaseConnection } from '@/lib/supabase/client';
import { getAllRates, getKenig, updateKenigRates } from '@/lib/supabase/rates';
import { useAllRates, useKenigRate } from '@/lib/hooks/rates';
import { Database, RefreshCw, CheckCircle, XCircle, AlertTriangle, Settings } from 'lucide-react';

export default function DebugSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [rawRatesData, setRawRatesData] = useState<any>(null);
  const [rawKenigData, setRawKenigData] = useState<any>(null);
  const [testResults, setTestResults] = useState<string[]>([]);
  
  const { rates: hookRates, loading: hookLoading, error: hookError } = useAllRates();
  const { rate: kenigRate, loading: kenigLoading, error: kenigError } = useKenigRate();

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setConnectionStatus('checking');
    addTestResult('Тестирование подключения к Supabase...');
    
    try {
      const isConnected = await checkSupabaseConnection();
      setConnectionStatus(isConnected ? 'connected' : 'error');
      addTestResult(isConnected ? '✅ Подключение успешно' : '❌ Подключение не удалось');
    } catch (error) {
      setConnectionStatus('error');
      addTestResult(`❌ Ошибка подключения: ${error}`);
    }
  };

  const fetchRawData = async () => {
    addTestResult('Загрузка сырых данных...');
    
    try {
      const [allRates, kenigData] = await Promise.all([
        getAllRates(),
        getKenig()
      ]);
      
      setRawRatesData(allRates);
      setRawKenigData(kenigData);
      addTestResult('✅ Сырые данные загружены');
    } catch (error) {
      addTestResult(`❌ Ошибка загрузки данных: ${error}`);
    }
  };

  const testUpdateRates = async () => {
    addTestResult('Тестирование обновления курсов...');
    
    try {
      const newSell = 94.0;
      const newBuy = 92.5;
      const success = await updateKenigRates(newSell, newBuy);
      
      if (success) {
        addTestResult(`✅ Курсы обновлены: продажа ${newSell}, покупка ${newBuy}`);
        // Refresh data
        await fetchRawData();
      } else {
        addTestResult('❌ Не удалось обновить курсы');
      }
    } catch (error) {
      addTestResult(`❌ Ошибка обновления: ${error}`);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    await testConnection();
    await fetchRawData();
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'checking':
        return <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#001D8D] flex items-center gap-2">
                <Database className="h-6 w-6" />
                Отладка Supabase интеграции
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button onClick={runAllTests}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Запустить все тесты
                </Button>
                <Button onClick={testConnection} variant="outline">
                  Тест подключения
                </Button>
                <Button onClick={fetchRawData} variant="outline">
                  Загрузить данные
                </Button>
                <Button onClick={testUpdateRates} variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Тест обновления
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#001D8D]">
                Статус подключения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                {getStatusIcon(connectionStatus)}
                <div>
                  <div className="font-medium">
                    {connectionStatus === 'connected' && 'Подключение активно'}
                    {connectionStatus === 'error' && 'Ошибка подключения'}
                    {connectionStatus === 'checking' && 'Проверка подключения...'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Не установлен'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#001D8D]">
                Переменные окружения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL</span>
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 font-mono break-all">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Не установлена'}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 font-mono">
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                      ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 8)}...` 
                      : 'Не установлена'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hooks Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* All Rates Hook */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#001D8D]">
                  useAllRates() Hook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={hookLoading ? "secondary" : "default"}>
                      {hookLoading ? 'Загрузка' : 'Готово'}
                    </Badge>
                    {hookError && (
                      <Badge variant="destructive">Ошибка</Badge>
                    )}
                  </div>
                  
                  {hookError && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {hookError}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {hookRates && (
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                      {JSON.stringify(hookRates, null, 2)}
                    </pre>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Kenig Rate Hook */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#001D8D]">
                  useKenigRate() Hook
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={kenigLoading ? "secondary" : "default"}>
                      {kenigLoading ? 'Загрузка' : 'Готово'}
                    </Badge>
                    {kenigError && (
                      <Badge variant="destructive">Ошибка</Badge>
                    )}
                  </div>
                  
                  {kenigError && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {kenigError}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {kenigRate && (
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                      {JSON.stringify(kenigRate, null, 2)}
                    </pre>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Raw Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Raw All Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#001D8D]">
                  Сырые данные getAllRates()
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rawRatesData ? (
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(rawRatesData, null, 2)}
                  </pre>
                ) : (
                  <div className="text-gray-500">Нет данных</div>
                )}
              </CardContent>
            </Card>

            {/* Raw Kenig Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#001D8D]">
                  Сырые данные getKenig()
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rawKenigData ? (
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(rawKenigData, null, 2)}
                  </pre>
                ) : (
                  <div className="text-gray-500">Нет данных</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#001D8D]">
                Журнал тестов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-auto">
                {testResults.length > 0 ? (
                  testResults.map((result, index) => (
                    <div key={index} className="mb-1">
                      {result}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">Нет результатов тестов</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#001D8D]">
                Инструкции по настройке
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Требуется настройка переменных окружения</strong>
                    <br />
                    Создайте файл .env.local в корне проекта с:
                    <br />
                    <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL=https://jetfadpysjsvtqdgnsjp.supabase.co</code>
                    <br />
                    <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-ключ</code>
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="text-yellow-400">-- SQL для создания таблицы kenig_rates</div>
                  <div>CREATE TABLE kenig_rates (</div>
                  <div>&nbsp;&nbsp;id SERIAL PRIMARY KEY,</div>
                  <div>&nbsp;&nbsp;usdt_sell_rate DECIMAL(10,4) NOT NULL,</div>
                  <div>&nbsp;&nbsp;usdt_buy_rate DECIMAL(10,4) NOT NULL,</div>
                  <div>&nbsp;&nbsp;updated_at TIMESTAMPTZ DEFAULT NOW()</div>
                  <div>);</div>
                  <br />
                  <div className="text-yellow-400">-- Вставка тестовых данных</div>
                  <div>INSERT INTO kenig_rates (id, usdt_sell_rate, usdt_buy_rate) VALUES (1, 93.5, 92.0);</div>
                  <br />
                  <div className="text-yellow-400">-- Включение Row Level Security</div>
                  <div>ALTER TABLE kenig_rates ENABLE ROW LEVEL SECURITY;</div>
                  <br />
                  <div className="text-yellow-400">-- Политика для публичного чтения</div>
                  <div>CREATE POLICY "Anyone can read kenig_rates"</div>
                  <div>&nbsp;&nbsp;ON kenig_rates FOR SELECT TO public USING (true);</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}