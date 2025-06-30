"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, AlertTriangle, TrendingUp, BarChart3, Activity, Globe, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useRates } from '@/lib/useRates';
import { GlobalSummary } from './components/GlobalSummary';
import { TopMovers } from './components/TopMovers';
import { MarketTable } from './components/MarketTable';
import { CoinDrawer } from './components/CoinDrawer';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';
import type { CoinMarketData } from '@/lib/coingecko';

export function RatesPageClient() {
  const { data, loading, error, refetch, calculate4hChange } = useRates();
  const [selectedCoin, setSelectedCoin] = useState<CoinMarketData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleCoinClick = (coin: CoinMarketData) => {
    setSelectedCoin(coin);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedCoin(null);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background matching calculator style */}
      <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <UnifiedVantaBackground 
            type="topology"
            color={0x94bdff}
            color2={0xFF6B35}
            backgroundColor={0xffffff}
            points={15}
            maxDistance={20}
            spacing={16}
            showDots={true}
            speed={1.4}
            mouseControls={true}
            touchControls={true}
            forceAnimate={true}
          />
        </div>

        {/* Gradient transitions matching calculator */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-100/20 z-5" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header with calculator-style container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="calculator-container max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4">
                Курсы криптовалют в реальном времени
              </h1>
              <p className="text-xl text-[#001D8D]/80 max-w-3xl mx-auto mb-8 leading-relaxed">
                Актуальные данные рынка криптовалют от CoinGecko API. Отслеживайте цены, тренды и рыночную аналитику с обновлениями каждые 5 минут.
              </p>
              
              {/* Status indicators with calculator styling */}
              <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Данные CoinGecko
                </Badge>
                <Badge variant="outline" className="text-[#001D8D]/70 border-[#001D8D]/20 px-4 py-2">
                  <Clock className="h-4 w-4 mr-2" />
                  Обновление каждые 5 минут
                </Badge>
                {data && (
                  <Badge variant="outline" className="text-[#001D8D]/70 border-[#001D8D]/20 px-4 py-2">
                    <Activity className="h-4 w-4 mr-2" />
                    Обновлено: {data.lastUpdated.toLocaleTimeString()}
                  </Badge>
                )}
              </div>
              
              {/* Controls with calculator button style */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Обновление...' : 'Обновить данные'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Error Alert with calculator styling */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 max-w-4xl mx-auto"
            >
              <div className="calculator-container">
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Ошибка загрузки данных:</strong> {error}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={refetch}
                      className="ml-4 text-red-800 border-red-300 hover:bg-red-100"
                    >
                      Попробовать снова
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            </motion.div>
          )}

          {/* Global Summary with calculator container style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="calculator-container max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#001D8D]">Обзор глобального рынка</h2>
              </div>
              <GlobalSummary 
                global={data?.global || null}
                fearGreed={data?.fearGreed || null}
                loading={loading}
              />
            </div>
          </motion.div>

          {/* Top Movers with calculator container style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="calculator-container max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#001D8D]">Лидеры роста и падения</h2>
              </div>
              <TopMovers 
                coins={data?.coins || []}
                calculate4hChange={calculate4hChange}
                loading={loading}
              />
            </div>
          </motion.div>

          {/* Market Table with calculator container style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <div className="calculator-container max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#001D8D]">Рыночные данные</h2>
                <Badge variant="outline" className="ml-auto text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  Живые данные
                </Badge>
              </div>
              <MarketTable 
                coins={data?.coins || []}
                onCoinClick={handleCoinClick}
                loading={loading}
              />
            </div>
          </motion.div>

          {/* API Info Cards with calculator styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            <div className="calculator-container">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#001D8D]">CoinGecko API</h3>
              </div>
              <p className="text-[#001D8D]/70 leading-relaxed">
                Данные от профессионального API CoinGecko с кэшированием на 30 секунд и оптимизированной частотой запросов.
              </p>
            </div>

            <div className="calculator-container">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                  <RefreshCw className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#001D8D]">Живые обновления</h3>
              </div>
              <p className="text-[#001D8D]/70 leading-relaxed">
                Рыночные данные обновляются каждые 5 минут, глобальные данные каждые 10 минут для оптимальной производительности.
              </p>
            </div>

            <div className="calculator-container">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#001D8D]">Умное кэширование</h3>
              </div>
              <p className="text-[#001D8D]/70 leading-relaxed">
                Edge-кэширование с SWR обеспечивает быструю загрузку при соблюдении лимитов API. Данные кэшируются на 30 секунд.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coin Detail Drawer */}
      <CoinDrawer 
        coin={selectedCoin}
        open={drawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
}