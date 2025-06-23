import { useState, useCallback, useRef, useEffect } from 'react';
import { useMarket, useGlobal, type CoinMarketData, type GlobalMarketData } from '@/lib/coingecko';
import { useFearGreed, type FearGreedData } from '@/lib/fng';

export interface RatesData {
  coins: CoinMarketData[];
  global: GlobalMarketData | null;
  fearGreed: FearGreedData | null;
  lastUpdated: Date;
}

export interface CoinSnapshot {
  coinId: string;
  price: number;
  timestamp: Date;
}

export function useRates() {
  const [snapshots, setSnapshots] = useState<Map<string, CoinSnapshot[]>>(new Map());
  const snapshotsRef = useRef(snapshots);
  snapshotsRef.current = snapshots;

  // Use individual hooks
  const { data: coins, error: coinsError, isLoading: coinsLoading, refetch: refetchCoins } = useMarket(10);
  const { data: global, error: globalError, isLoading: globalLoading, refetch: refetchGlobal } = useGlobal();
  const { data: fearGreed, error: fearGreedError, isLoading: fearGreedLoading, refetch: refetchFearGreed } = useFearGreed();

  // Store snapshots when coins data updates
  const storeSnapshots = useCallback((coinsData: CoinMarketData[]) => {
    if (!coinsData || coinsData.length === 0) return;

    setSnapshots(prev => {
      const newSnapshots = new Map(prev);
      const now = new Date();
      
      coinsData.forEach(coin => {
        const coinSnapshots = newSnapshots.get(coin.id) || [];
        
        // Add current snapshot
        coinSnapshots.push({
          coinId: coin.id,
          price: coin.current_price,
          timestamp: now,
        });
        
        // Keep only snapshots from last 4 hours
        const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
        const filteredSnapshots = coinSnapshots.filter(
          snapshot => snapshot.timestamp > fourHoursAgo
        );
        
        newSnapshots.set(coin.id, filteredSnapshots);
      });
      
      return newSnapshots;
    });
  }, []);

  // Store snapshots when coins data changes - moved to useEffect to prevent infinite re-renders
  useEffect(() => {
    if (coins && coins.length > 0) {
      storeSnapshots(coins);
    }
  }, [coins, storeSnapshots]);

  const calculate4hChange = useCallback((coinId: string, currentPrice: number): number | null => {
    const coinSnapshots = snapshotsRef.current.get(coinId);
    if (!coinSnapshots || coinSnapshots.length < 2) return null;

    // Find snapshot closest to 4 hours ago
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const oldestSnapshot = coinSnapshots.reduce((oldest, current) => {
      const oldestDiff = Math.abs(oldest.timestamp.getTime() - fourHoursAgo.getTime());
      const currentDiff = Math.abs(current.timestamp.getTime() - fourHoursAgo.getTime());
      return currentDiff < oldestDiff ? current : oldest;
    });

    return ((currentPrice - oldestSnapshot.price) / oldestSnapshot.price) * 100;
  }, []);

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
    calculate4hChange,
  };
}