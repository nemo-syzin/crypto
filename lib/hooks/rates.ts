import { useState, useEffect, useCallback } from 'react';

interface KenigRate {
  sell: number;
  buy: number;
  updated_at: string;
}

interface AllRates {
  kenig: { sell: number | null; buy: number | null; updated_at?: string };
  bestchange: { sell: number | null; buy: number | null; updated_at?: string };
  energo: { sell: number | null; buy: number | null; updated_at?: string };
  timestamp: string;
  isFromDatabase: boolean;
  error?: string;
}

// Simplified rates hook
export function useAllRates() {
  const [rates, setRates] = useState<AllRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/rates');
      if (!response.ok) throw new Error('Failed to fetch rates');
      
      const data = await response.json();
      setRates(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  return { rates, loading, error, lastUpdated, refetch: fetchRates };
}

// Simplified kenig rate hook
export function useKenigRate() {
  const [rate, setRate] = useState<KenigRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/rates');
      if (!response.ok) throw new Error('Failed to fetch rates');
      
      const data = await response.json();
      if (data.kenig) {
        setRate({
          sell: data.kenig.sell,
          buy: data.kenig.buy,
          updated_at: data.kenig.updated_at || new Date().toISOString()
        });
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch kenig rate');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate();
    const interval = setInterval(fetchRate, 30000);
    return () => clearInterval(interval);
  }, [fetchRate]);

  return { rate, loading, error, lastUpdated, refetch: fetchRate };
}