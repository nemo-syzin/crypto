"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  ExternalLink, 
  Database, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Globe,
  Activity,
  Clock,
  Shield
} from 'lucide-react';

interface BestChangeSummary {
  total_records: number;
  active_records: number;
  inactive_records: number;
  sources: string[];
  currencies: {
    base: string[];
    quote: string[];
  };
  operational_modes: string[];
  sample_active_exchanges: Array<{
    pair: string;
    source: string;
    sell: number;
    buy: number;
    min_amount: number;
    max_amount: number;
    reserve: number;
    operational_mode: string;
    is_active: boolean;
    conditions: string;
    exchange_source: string;
  }>;
}

interface TestResponse {
  status: string;
  message: string;
  summary: BestChangeSummary;
  xml_feed_url: string;
  instructions: string[];
}

export function BestChangeAdminClient() {
  const [testData, setTestData] = useState<TestResponse | null>(null);
  const [xmlData, setXmlData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTestData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bestchange-feed/test');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка получения тестовых данных');
      }
      
      setTestData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const fetchXmlData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bestchange-feed');
      const xmlText = await response.text();
      
      if (!response.ok) {
        throw new Error('Ошибка получения XML фида');
      }
      
      setXmlData(xmlText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/10 to-blue-100/20 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Заголовок */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4">
              BestChange Админ
            </h1>
            <p className="text-lg text-[#001D8D]/70 leading-relaxed">
              Управление XML фидом для интеграции с BestChange
            </p>
          </div>

          {/* Ошибки */}
          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Ошибка:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Левая колонка - Статистика и управление */}
            <div className="space-y-6">
              
              {/* Статистика */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#001D8D] flex items-center gap-3">
                    <Database className="h-6 w-6" />
                    Статистика фида
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {testData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-[#001D8D] mb-1">
                            {testData.summary.total_records}
                          </div>
                          <div className="text-sm text-[#001D8D]/70">Всего записей</div>
                        </div>
                        
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {testData.summary.active_records}
                          </div>
                          <div className="text-sm text-green-800">Активных</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-[#001D8D] mb-2">Источники:</h4>
                          <div className="flex flex-wrap gap-2">
                            {testData.summary.sources.map(source => (
                              <Badge key={source} variant="outline" className="text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-[#001D8D] mb-2">Базовые валюты:</h4>
                          <div className="flex flex-wrap gap-2">
                            {testData.summary.currencies.base.map(currency => (
                              <Badge key={currency} variant="outline" className="text-xs">
                                {currency}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-[#001D8D] mb-2">Режимы работы:</h4>
                          <div className="flex flex-wrap gap-2">
                            {testData.summary.operational_modes.map(mode => (
                              <Badge key={mode} variant="outline" className="text-xs">
                                {mode}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001D8D] mx-auto mb-4"></div>
                      <p className="text-[#001D8D]/70">Загрузка статистики...</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Управление */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#001D8D] flex items-center gap-3">
                    <Settings className="h-6 w-6" />
                    Управление фидом
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={fetchTestData}
                    disabled={loading}
                    className="w-full bg-[#001D8D] text-white hover:opacity-90"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Обновить статистику
                  </Button>

                  <Button 
                    onClick={fetchXmlData}
                    disabled={loading}
                    variant="outline"
                    className="w-full text-[#001D8D] border-[#001D8D]/20"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Загрузить XML фид
                  </Button>

                  <Button 
                    onClick={() => window.open('/api/bestchange-feed', '_blank')}
                    variant="outline"
                    className="w-full text-[#001D8D] border-[#001D8D]/20"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Открыть XML в новой вкладке
                  </Button>
                </CardContent>
              </Card>

              {/* Примеры активных направлений */}
              {testData && testData.summary.sample_active_exchanges.length > 0 && (
                <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-[#001D8D] flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Примеры активных направлений
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {testData.summary.sample_active_exchanges.map((exchange, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-[#001D8D]">
                              {exchange.pair}
                            </div>
                            <Badge className={`text-xs ${
                              exchange.operational_mode === 'auto' ? 'bg-green-100 text-green-800' :
                              exchange.operational_mode === 'semi-auto' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {exchange.operational_mode}
                            </Badge>
                          </div>
                          <div className="text-sm text-[#001D8D]/70 space-y-1">
                            <div>Продажа: {exchange.sell} | Покупка: {exchange.buy}</div>
                            <div>Мин: {exchange.min_amount} | Макс: {exchange.max_amount}</div>
                            <div>Резерв: {exchange.reserve}</div>
                            {exchange.conditions && (
                              <div>Условия: {exchange.conditions}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Правая колонка - XML фид */}
            <div className="space-y-6">
              
              {/* XML Preview */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#001D8D] flex items-center gap-3">
                    <Globe className="h-6 w-6" />
                    XML Фид
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {xmlData ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-800">XML успешно сгенерирован</span>
                      </div>
                      
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-xs font-mono">
                        <pre>{xmlData}</pre>
                      </div>
                      
                      <div className="text-xs text-[#001D8D]/60">
                        Размер: {new Blob([xmlData]).size} байт
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Globe className="h-12 w-12 text-[#001D8D]/40 mx-auto mb-4" />
                      <p className="text-[#001D8D]/70 mb-4">
                        XML фид не загружен
                      </p>
                      <Button 
                        onClick={fetchXmlData}
                        disabled={loading}
                        className="bg-[#001D8D] text-white hover:opacity-90"
                      >
                        Загрузить XML
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Инструкции */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#001D8D] flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Следующие шаги
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#001D8D] text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <div>
                        <div className="font-semibold text-[#001D8D]">Проверьте XML</div>
                        <div className="text-[#001D8D]/70">Убедитесь, что XML корректно генерируется и содержит ваши данные</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#001D8D] text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <div>
                        <div className="font-semibold text-[#001D8D]">Валидация XML</div>
                        <div className="text-[#001D8D]/70">Проверьте XML на валидность с помощью онлайн-валидатора</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#001D8D] text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <div>
                        <div className="font-semibold text-[#001D8D]">Развертывание</div>
                        <div className="text-[#001D8D]/70">Разверните приложение на хостинге (Netlify/Vercel)</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#001D8D] text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <div>
                        <div className="font-semibold text-[#001D8D]">Интеграция</div>
                        <div className="text-[#001D8D]/70">Предоставьте URL фида команде BestChange</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Полезные ссылки */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#001D8D] flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Полезные ссылки
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-[#001D8D] border-[#001D8D]/20"
                    onClick={() => window.open('https://www.xmlvalidation.com/', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    XML Validator
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-[#001D8D] border-[#001D8D]/20"
                    onClick={() => window.open('/api/bestchange-feed/test', '_blank')}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Тестовый API (JSON)
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-[#001D8D] border-[#001D8D]/20"
                    onClick={() => window.open('/api/bestchange-feed', '_blank')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    XML Фид (Production)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}