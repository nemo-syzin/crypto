"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, AlertTriangle, TrendingUp, Calculator, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRates } from '@/lib/useRates';
import { GlobalSummary } from './components/GlobalSummary';
import { TopMovers } from './components/TopMovers';
import { MarketTable } from './components/MarketTable';
import { CoinDrawer } from './components/CoinDrawer';
import { CalculatorRatesDisplay } from './components/CalculatorRatesDisplay';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';
import type { CoinMarketData } from '@/lib/coingecko';

export function RatesPageClient() {
  const { data, loading, error, refetch, calculate4hChange } = useRates();
  const [selectedCoin, setSelectedCoin] = useState<CoinMarketData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calculator');

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
      {/* Background */}
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

        {/* Gradient transitions */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-100/20 z-5" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4">
              Профессиональные курсы и аналитика
            </h1>
            <p className="text-xl text-[#001D8D]/80 max-w-3xl mx-auto mb-8">
              Интерактивный калькулятор курсов и полная аналитика криптовалютного рынка в реальном времени
            </p>
            
            {/* API Status Badge */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
              <Badge variant="outline" className="text-[#001D8D]/70">
                Обновление каждые 30 секунд
              </Badge>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button
                onClick={refetch}
                disabled={loading}
                className="bg-[#001D8D] hover:bg-[#001D8D]/90 text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Обновить данные
              </Button>
              
              {data && (
                <div className="flex items-center gap-2 text-sm text-[#001D8D]/70">
                  <Clock className="h-4 w-4" />
                  Обновлено: {data.lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
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
            </motion.div>
          )}

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white/90 backdrop-blur-sm border-2 border-[#001D8D]/20 p-1">
                  <TabsTrigger 
                    value="calculator" 
                    className="data-[state=active]:bg-[#001D8D] data-[state=active]:text-white flex items-center gap-2"
                  >
                    <Calculator className="h-4 w-4" />
                    Калькулятор курсов
                  </TabsTrigger>
                  <TabsTrigger 
                    value="market" 
                    className="data-[state=active]:bg-[#001D8D] data-[state=active]:text-white flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Рыночная аналитика
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="calculator" className="space-y-8">
                <CalculatorRatesDisplay />
              </TabsContent>

              <TabsContent value="market" className="space-y-8">
                {/* Global Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <GlobalSummary 
                    global={data?.global || null}
                    fearGreed={data?.fearGreed || null}
                    loading={loading}
                  />
                </motion.div>

                {/* Top Movers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <TopMovers 
                    coins={data?.coins || []}
                    calculate4hChange={calculate4hChange}
                    loading={loading}
                  />
                </motion.div>

                {/* Market Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <MarketTable 
                    coins={data?.coins || []}
                    onCoinClick={handleCoinClick}
                    loading={loading}
                  />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* API Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#001D8D]/10">
              <h3 className="text-xl font-bold text-[#001D8D] mb-4">Профессиональный калькулятор</h3>
              <p className="text-[#001D8D]/70">
                Интерактивный калькулятор в стиле цифрового дисплея с актуальными курсами обмена и математическими операциями.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#001D8D]/10">
              <h3 className="text-xl font-bold text-[#001D8D] mb-4">Живые обновления</h3>
              <p className="text-[#001D8D]/70">
                Курсы обновляются каждые 30 секунд, рыночные данные каждые 5 минут. Fear & Greed Index обновляется ежечасно.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#001D8D]/10">
              <h3 className="text-xl font-bold text-[#001D8D] mb-4">Умное кэширование</h3>
              <p className="text-[#001D8D]/70">
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