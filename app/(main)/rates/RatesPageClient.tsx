"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, AlertTriangle, TrendingUp, BarChart3, Activity, Target, Globe } from 'lucide-react';
import { useTopCoins } from '@/lib/coingecko-api';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MarketTable } from './components/MarketTable';
import { CoinDrawer } from './components/CoinDrawer';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';
import type { CoinMarketData } from '@/lib/coingecko';

export function RatesPageClient() {
  const { coins: cryptoCoins, loading: cryptoLoading, error: cryptoError, refetch } = useTopCoins('usd', 50);
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
          {/* Header with simplified title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4 flex items-center justify-center gap-3">
              <Globe className="h-10 w-10" />
              Global Crypto Market
            </h1>
            <p className="text-xl text-[#001D8D]/80 max-w-4xl mx-auto mb-8 leading-relaxed">
              Real-time cryptocurrency market data powered by CoinGecko API.
              Track prices, trends, trading volumes, and market analytics with regular updates.
            </p>
            
            {/* Simple refresh button */}
            <div className="flex justify-center">
              <button
                onClick={refetch}
                disabled={cryptoLoading}
                className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className={`h-5 w-5 ${cryptoLoading ? 'animate-spin' : ''}`} />
                {cryptoLoading ? 'Updating data...' : 'Refresh data'}
              </button>
            </div>
          </motion.div>

          {/* Error Alert with calculator styling */}
          {cryptoError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 max-w-5xl mx-auto"
            >
              <div className="calculator-container">
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Error loading data:</strong> {cryptoError}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={refetch}
                      className="ml-4 text-red-800 border-red-300 hover:bg-red-100"
                    >
                      Try again
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            </motion.div>
          )}

          {/* Market Table - Simplified */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="max-w-7xl mx-auto">
              <MarketTable 
                coins={[]}
                cryptoCoins={cryptoCoins}
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