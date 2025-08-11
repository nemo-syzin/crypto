"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { RefreshCw, AlertTriangle, Globe, PieChart, BarChart3, TrendingUp, TrendingDown, DollarSign, Clock, Info } from 'lucide-react';
import { useMarket, useCoinHistory } from '@/lib/coingecko';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MarketTable } from './components/MarketTable';
import { CoinDrawer } from './components/CoinDrawer';
import { MarketOverview } from './components/MarketOverview';
import { TrendingCoins } from './components/TrendingCoins';
import { MarketStats } from './components/MarketStats';
import type { CoinMarketData } from '@/lib/coingecko';

// Динамический импорт 3D-фона с отключенным SSR для улучшения производительности
const UnifiedVantaBackground = dynamic(
  () => import('@/components/shared/UnifiedVantaBackground').then(mod => ({ default: mod.UnifiedVantaBackground })),
  { 
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />
  }
);

export function RatesPageClient() {
  const { data: cryptoCoins, loading: cryptoLoading, error: cryptoError, refetch } = useMarket(50);
  const { data: btcChartData, loading: btcChartLoading } = useCoinHistory('bitcoin', 30);
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
        {/* Оптимизированный фон */}
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
          {/* Header with simplified title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4 flex items-center justify-center gap-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#001D8D] mb-6">
              Рыночные данные криптовалют
            </h1>
            <p className="text-xl text-[#001D8D]/80 max-w-4xl mx-auto mb-8 leading-relaxed">
              Комплексные рыночные данные криптовалют с актуальными ценами, трендами и аналитикой.
              Отслеживайте топ криптовалюты, движения рынка и объемы торгов в одном месте.
            </p>
          </motion.div>

          {/* Error Alert with calculator styling */}
          {cryptoError && !cryptoLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
              className="mb-8 max-w-5xl mx-auto"
            >
              <div className="calculator-container border-red-300">
                <Alert className="bg-red-50 border-red-200 text-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Ошибка загрузки данных:</strong> {cryptoError}
                    <div className="mt-2 text-sm">
                      Проверьте, что ваш API-ключ CoinGecko правильно настроен в переменных окружения.
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={refetch}
                      className="mt-3 text-red-800 border-red-300 hover:bg-red-100"
                    >
                      Повторить попытку
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            </motion.div>
          )}

          {/* Market Overview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="max-w-7xl mx-auto">
              <MarketOverview 
                coins={cryptoCoins} 
                btcChartData={btcChartData}
                loading={cryptoLoading || btcChartLoading} 
              />
            </div>
          </motion.div>

          {/* Trending Coins Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="max-w-7xl mx-auto">
              <TrendingCoins 
                coins={cryptoCoins} 
                onCoinClick={handleCoinClick}
                loading={cryptoLoading} 
              />
            </div>
          </motion.div>

          {/* Market Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <div className="max-w-7xl mx-auto">
              <MarketStats 
                coins={cryptoCoins} 
                loading={cryptoLoading} 
              />
            </div>
          </motion.div>

          {/* Market Table - Simplified */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <div className="max-w-7xl mx-auto">
              <MarketTable 
                coins={cryptoCoins || []}
                onCoinClick={handleCoinClick}
                loading={cryptoLoading}
              />
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
  )
}