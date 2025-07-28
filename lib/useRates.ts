import { useState, useCallback, useRef, useEffect } from 'react';
import { useMarket, useGlobal, type CoinMarketData, type GlobalMarketData } from '@/lib/coingecko';
import { useFearGreed, type FearGreedData } from '@/lib/fng';

interface RatesData {
  coins: CoinMarketData[];
  global: GlobalMarketData | null;
  fearGreed: FearGreedData | null;
  lastUpdated: Date;
}


export function useRates() {

  // Use individual hooks - updated to fetch 20 coins instead of 10
  const { data: coins, error: coinsError, isLoading: coinsLoading, refetch: refetchCoins } = useMarket(20);
  const { data: global, error: globalError, isLoading: globalLoading, refetch: refetchGlobal } = useGlobal();
  const { data: fearGreed, error: fearGreedError, isLoading: fearGreedLoading, refetch: refetchFearGreed } = useFearGreed();


  const refetch = useCallback(async () => {
    await Promise.all([
      refetchCoins(),
      refetchGlobal(),
      refetchFearGreed(),
    ]);
  }, [refetchCoins, refetchGlobal, refetchFearGreed]);

  const data: RatesData = {
    coins: coins || [],
    global: global || null,
    fearGreed: fearGreed || null,
    lastUpdated: new Date(),
  };

  const loading = coinsLoading || globalLoading || fearGreedLoading;
  const error = coinsError || globalError || fearGreedError;

  return {
    data,
    loading,
    error,
    refetch,
  };
}