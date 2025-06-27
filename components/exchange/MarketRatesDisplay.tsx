"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAllRates } from '@/lib/hooks/rates';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Clock, 
  Activity,
  Zap,
  Shield,
  Award,
  Globe,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

interface RateBlock {
  id: string;
  source: string;
  displayName: string;
  priority: number; // 1-3, влияет на ширину блока
  color: string;
  description: string;
  features: string[];
}

const rateBlocks: RateBlock[] = [
  {
    id: 'kenig',
    source: 'kenig',
    displayName: 'KenigSwap',
    priority: 1, // Самый высокий приоритет - самый широкий блок
    color: '#001D8D',
    description: 'Наш основной обменный сервис с лучшими условиями для клиентов. Прозрачные курсы, быстрые операции и полная безопасность.',
    features: [
      'Мгновенные операции',
      'Без скрытых комиссий', 
      'Банковский уровень безопасности',
      'Поддержка 24/7'
    ]
  },
  {
    id: 'bestchange',
    source: 'bestchange',
    displayName: 'BestChange',
    priority: 2,
    color: '#10b981',
    description: 'Агрегатор обменников для сравнения курсов на рынке. Помогает найти лучшие предложения среди проверенных партнеров.',
    features: [
      'Агрегация курсов',
      'Проверенные обменники',
      'Рыночная аналитика',
      'Сравнение условий'
    ]
  },
  {
    id: 'energo',
    source: 'energo',
    displayName: 'EnergoTransBank',
    priority: 3,
    color: '#8b5cf6',
    description: 'Справочные курсы доллара от банка для анализа и сравнения. Используется для оценки рыночной ситуации.',
    features: [
      'Банковские курсы',
      'Справочная информация',
      'Рыночный анализ',
      'Официальные данные'
    ]
  }
];

export function MarketRatesDisplay() {
  const { rates, loading, error, lastUpdated, refetch } = useAllRates();
  const [activeRate, setActiveRate] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  // Рассчитываем ширину блоков на основе приоритета
  const getBlockWidth = (priority: number): string => {
    const widths = {
      1: '45%',  // KenigSwap - самый широкий
      2: '35%',  // BestChange
      3: '20%'   // EnergoTransBank - справочно
    };
    return widths[priority as keyof typeof widths] || '33%';
  };

  const formatRate = (rate: number | null): string => {
    if (rate === null || rate === undefined || isNaN(rate)) return '—';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate);
  };

  const getRateData = (source: string) => {
    if (!rates) return { sell: null, buy: null, updated_at: null };
    
    switch (source) {
      case 'kenig':
        return rates.kenig;
      case 'bestchange':
        return rates.bestchange;
      case 'energo':
        return rates.energo;
      default:
        return { sell: null, buy: null, updated_at: null };
    }
  };

  const activeRateData = rateBlocks.find(r => r.id === activeRate);
  const activeRateValues = activeRateData ? getRateData(activeRateData.source) : null;

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center">
        <Badge className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white px-6 py-2 text-lg mb-4">
          <Activity className="h-5 w-5 mr-2" />
          Курсы обмена в реальном времени
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-3">
          Актуальные курсы валют
        </h2>
        <p className="text-lg text-[#001D8D]/70 max-w-3xl mx-auto mb-4">
          Следите за изменениями курсов в режиме реального времени. Данные обновляются каждые 30 секунд.
        </p>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            onClick={refetch}
            disabled={loading}
            className="bg-[#001D8D] hover:bg-[#001D8D]/90 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Обновить курсы
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'border-green-500 text-green-700' : 'border-gray-300'}
            >
              <Zap className="h-4 w-4 mr-1" />
              {autoRefresh ? 'Авто-обновление ВКЛ' : 'Авто-обновление ВЫКЛ'}
            </Button>
            
            {lastUpdated && (
              <div className="flex items-center gap-2 text-sm text-[#001D8D]/70">
                <Clock className="h-4 w-4" />
                {lastUpdated.toLocaleTimeString('ru-RU')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Ошибка загрузки курсов</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Market Rates Strip */}
      <div className="relative w-full h-40 bg-gradient-to-r from-[#001D8D] to-blue-700 rounded-xl overflow-hidden shadow-2xl">
        {/* Геометрический паттерн фона */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent" />
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
            <div className="bg-white/90 rounded-lg p-4 flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-[#001D8D]" />
              <span className="text-[#001D8D] font-medium">Обновление курсов...</span>
            </div>
          </div>
        )}

        {/* Rate Blocks */}
        <div className="relative flex h-full">
          {rateBlocks.map((block, index) => {
            const rateData = getRateData(block.source);
            const isActive = activeRate === block.id;
            const hasData = rateData.sell !== null && rateData.buy !== null;

            return (
              <motion.div
                key={block.id}
                className="relative cursor-pointer group transition-all duration-500 ease-out"
                style={{ 
                  width: getBlockWidth(block.priority),
                  backgroundColor: isActive ? block.color : 'transparent'
                }}
                onMouseEnter={() => setActiveRate(block.id)}
                onMouseLeave={() => setActiveRate(null)}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                {/* Разделительная линия */}
                {index > 0 && (
                  <div className="absolute left-0 top-0 w-px h-full bg-white/30" />
                )}

                {/* Контент блока */}
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  {/* Название источника */}
                  <motion.h3 
                    className="text-lg md:text-xl font-bold text-white mb-2"
                    animate={{ 
                      scale: isActive ? 1.1 : 1,
                      opacity: isActive ? 1 : 0.9
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {block.displayName}
                  </motion.h3>

                  {/* Курсы */}
                  {hasData ? (
                    <div className="space-y-1">
                      <div className="text-sm text-white/80">
                        Продажа: <span className="font-bold text-white">{formatRate(rateData.sell)}</span>
                      </div>
                      <div className="text-sm text-white/80">
                        Покупка: <span className="font-bold text-white">{formatRate(rateData.buy)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-white/60">
                      Данные загружаются...
                    </div>
                  )}

                  {/* Индикатор активности */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ 
                      scaleX: isActive ? 1 : 0,
                      opacity: isActive ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>

                {/* Hover эффект */}
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Status indicator */}
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                  hasData ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
              </motion.div>
            );
          })}
        </div>

        {/* Геометрические акценты */}
        <div className="absolute top-0 left-0 w-8 h-8 bg-white/20 transform rotate-45 -translate-x-4 -translate-y-4" />
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-white/20 transform rotate-45 translate-x-3 translate-y-3" />
      </div>

      {/* Detailed Information Panel */}
      <div className="relative min-h-[250px]">
        <AnimatePresence mode="wait">
          {activeRateData && activeRateValues ? (
            <motion.div
              key={activeRateData.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-xl border-2 border-gray-100 p-8 shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-16 h-16 flex items-center justify-center text-white font-bold text-xl rounded-lg"
                  style={{ backgroundColor: activeRateData.color }}
                >
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#001D8D] mb-1">
                    {activeRateData.displayName}
                  </h3>
                  <div className="w-12 h-1 rounded-full" style={{ backgroundColor: activeRateData.color }} />
                </div>
              </div>

              {/* Rates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-900">Курс продажи USDT</span>
                  </div>
                  <div className="text-3xl font-bold text-green-700 mb-1">
                    {formatRate(activeRateValues.sell)}
                  </div>
                  <div className="text-sm text-green-600">
                    За 1 USDT вы получите
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Курс покупки USDT</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-700 mb-1">
                    {formatRate(activeRateValues.buy)}
                  </div>
                  <div className="text-sm text-blue-600">
                    За 1 USDT вы заплатите
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-[#001D8D]/80 leading-relaxed mb-6">
                {activeRateData.description}
              </p>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-[#001D8D] mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Особенности и преимущества:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeRateData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: activeRateData.color }}
                      />
                      <span className="text-[#001D8D]/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last Updated */}
              {activeRateValues.updated_at && (
                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm text-[#001D8D]/60">
                  <Clock className="h-4 w-4" />
                  Последнее обновление: {new Date(activeRateValues.updated_at).toLocaleString('ru-RU')}
                </div>
              )}

              {/* Geometric accent */}
              <div className="absolute top-4 right-4 w-3 h-3 transform rotate-45" style={{ backgroundColor: activeRateData.color }} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-64 text-center"
            >
              <div className="text-[#001D8D]/60">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-lg font-medium">
                  Наведите курсор на блок выше, чтобы увидеть подробную информацию о курсах
                </p>
                <p className="text-sm text-[#001D8D]/50 mt-2">
                  Данные обновляются автоматически каждые 30 секунд
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Additional Market Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-blue-900">Безопасность</h3>
            </div>
            <p className="text-blue-800 text-sm leading-relaxed">
              Все курсы проверяются в режиме реального времени. Используем только проверенные источники данных.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-900">Скорость</h3>
            </div>
            <p className="text-green-800 text-sm leading-relaxed">
              Курсы обновляются каждые 30 секунд. Мгновенное отображение изменений на рынке.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-purple-900">Глобальность</h3>
            </div>
            <p className="text-purple-800 text-sm leading-relaxed">
              Интеграция с ведущими мировыми источниками курсов валют и криптовалют.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}