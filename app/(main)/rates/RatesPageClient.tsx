"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle, Globe, PieChart, BarChart3, TrendingUp, TrendingDown, DollarSign, Clock, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MarketOverview } from './components/MarketOverview';
import { TrendingCoins } from './components/TrendingCoins';
import { MarketStats } from './components/MarketStats';
import { MarketTable } from './components/MarketTable';
import { CoinDrawer } from './components/CoinDrawer';
import { useMarket, useCoinHistory } from '@/lib/coingecko';
import type { CoinMarketData } from '@/lib/coingecko';

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
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Main content section */}
      <section className="relative py-20 bg-transparent overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* Header with simplified title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4 flex items-center justify-center gap-3">
              Рыночные курсы обмена криптовалют
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

      {/* Coin Drawer */}
      <CoinDrawer
        coin={selectedCoin}
        open={drawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
}
