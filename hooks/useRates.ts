import useSWR from 'swr';
import { useState, useCallback, useRef } from 'react';
import { getCoinHistory, type CoinMarketData, type GlobalMarketData, type CoinPriceHistory } from '@/lib/coingecko';
import { type FearGreedData } from '@/lib/fng';

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

// Fetcher function for SWR - use API endpoint instead of direct imports
const fetcher = async (): Promise<RatesData> => {
  const response = await fetch('/api/rates');
  if (!response.ok) {
    throw new Error('Failed to fetch rates data');
  }
  const data = await response.json();
  return {
    ...data,
    lastUpdated: new Date(),
  };
};

export function useRates() {
  const [snapshots, setSnapshots] = useState<Map<string, CoinSnapshot[]>>(new Map());
  const snapshotsRef = useRef(snapshots);
  snapshotsRef.current = snapshots;

  const { data, error, isLoading, mutate } = useSWR<RatesData>(
    'crypto-rates',
    fetcher,
    {
      refreshInterval: 60000, // 60 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
      onSuccess: (data) => {
        // Store snapshots for 4h change calculation
        if (data?.coins) {
          setSnapshots(prev => {
            const newSnapshots = new Map(prev);
            const now = new Date();
            
            data.coins.forEach(coin => {
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
        }
      },
    }
  );

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

  const refetch = useCallback(() => {
    return mutate();
  }, [mutate]);

  return {
    data,
    loading: isLoading,
    error: error?.message || null,
    refetch,
    calculate4hChange,
  };
}

export function useCoinHistory(coinId: string, days: number = 1) {
  const { data, error, isLoading } = useSWR<CoinPriceHistory>(
    coinId ? `coin-history-${coinId}-${days}` : null,
    () => getCoinHistory(coinId, days),
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  return { 
    data, 
    loading: isLoading, 
    error: error?.message || null 
  };
}