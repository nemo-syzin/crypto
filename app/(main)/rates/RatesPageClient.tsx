"use client";

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
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

// Оптимизированные варианты анимации с tween вместо spring
const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Мемоизированный компонент для API Info Cards
const ApiInfoCards = React.memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#001D8D]/10">
      <h3 className="text-xl font-bold text-[#001D8D] mb-4">CoinGecko API</h3>
      <p className="text-[#001D8D]/70">
        Powered by CoinGecko's professional API with 30-second caching and optimized request frequency to stay within limits.
      </p>
    </div>

    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#001D8D]/10">
      <h3 className="text-xl font-bold text-[#001D8D] mb-4">Live Updates</h3>
      <p className="text-[#001D8D]/70">
        Market data refreshes every 5 minutes, global data every 10 minutes. Fear & Greed Index updates hourly for optimal performance.
      </p>
    </div>

    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#001D8D]/10">
      <h3 className="text-xl font-bold text-[#001D8D] mb-4">Smart Caching</h3>
      <p className="text-[#001D8D]/70">
        Edge caching with SWR ensures fast loading times while respecting API rate limits. Data is cached for 30 seconds at the edge.
      </p>
    </div>
  </div>
));

ApiInfoCards.displayName = 'ApiInfoCards';

export function RatesPageClient() {
  const { data, loading, error, refetch, calculate4hChange } = useRates();
  const [selectedCoin, setSelectedCoin] = useState<CoinMarketData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Мемоизируем обработчики для предотвращения ненужных ререндеров
  const handleCoinClick = useCallback((coin: CoinMarketData) => {
    setSelectedCoin(coin);
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    // Используем setTimeout для предотвращения мерцания при закрытии
    setTimeout(() => setSelectedCoin(null), 300);
  }, []);

  // Мемоизируем компоненты для предотвращения ненужных ререндеров
  const errorAlert = useMemo(() => {
    if (!error) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-8"
      >
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Error loading data:</strong> {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refetch}
              className="ml-4 text-red-800 border-red-300 hover:bg-red-100"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }, [error, refetch]);

  // Мемоизируем заголовок
  const pageHeader = useMemo(() => (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4">
        Live Crypto Rates
      </h1>
      <p className="text-xl text-[#001D8D]/80 max-w-3xl mx-auto mb-8">
        Real-time cryptocurrency market data powered by CoinGecko API. Track prices, trends, and market analysis with live updates.
      </p>
      
      {/* API Status Badge */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <TrendingUp className="h-3 w-3 mr-1" />
          Live CoinGecko Data
        </Badge>
        <Badge variant="outline" className="text-[#001D8D]/70">
          Updates every 5 minutes
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
          Refresh Data
        </Button>
        
        {data && (
          <div className="flex items-center gap-2 text-sm text-[#001D8D]/70">
            <Clock className="h-4 w-4" />
            Last updated: {data.lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  ), [data, loading, refetch]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden scroll-optimized">
      {/* Background - упрощенный для лучшей производительности */}
      <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/10 to-blue-100/20 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <UnifiedVantaBackground 
            type="dots" // Используем dots вместо topology для лучшей производительности
            color={0x94bdff}
            color2={0xFF6B35}
            backgroundColor={0xffffff}
            points={10}
            maxDistance={15}
            spacing={20}
            showDots={true}
            speed={0.8}
            mouseControls={false} // Отключаем для экономии ресурсов
            touchControls={false} // Отключаем для экономии ресурсов
            forceAnimate={false} // Отключаем принудительную анимацию
          />
        </div>

        {/* Gradient transitions */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-100/20 z-5" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            {pageHeader}
          </motion.div>

          {/* Error Alert */}
          {errorAlert}

          {/* Global Summary */}
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          >
            <GlobalSummary 
              global={data?.global || null}
              fearGreed={data?.fearGreed || null}
              loading={loading}
            />
          </motion.div>

          {/* Top Movers */}
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          >
            <TopMovers 
              coins={data?.coins || []}
              calculate4hChange={calculate4hChange}
              loading={loading}
            />
          </motion.div>

          {/* Market Table */}
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
          >
            <MarketTable 
              coins={data?.coins || []}
              onCoinClick={handleCoinClick}
              loading={loading}
            />
          </motion.div>

          {/* API Info Cards */}
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
          >
            <ApiInfoCards />
          </motion.div>
        </div>
      </section>

      {/* Coin Detail Drawer - используем AnimatePresence для плавного появления/исчезновения */}
      <AnimatePresence>
        {drawerOpen && (
          <CoinDrawer 
            coin={selectedCoin}
            open={drawerOpen}
            onClose={handleDrawerClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}