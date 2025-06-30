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

// Enhanced rates hook with better error handling and fallback
export function useAllRates() {
  const [rates, setRates] = useState<AllRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/rates', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate that we have actual rate data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      // Ensure we have at least some valid rates
      const hasValidRates = (
        (data.kenig?.sell && data.kenig?.buy) ||
        (data.bestchange?.sell && data.bestchange?.buy) ||
        (data.energo?.sell && data.energo?.buy)
      );
      
      if (!hasValidRates) {
        console.warn('No valid rates found in response:', data);
        // Still set the data but with a warning
        setRates(data);
      } else {
        setRates(data);
      }
      
      setLastUpdated(new Date());
      console.log('✅ Rates updated successfully:', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rates';
      console.error('❌ Error fetching rates:', errorMessage);
      setError(errorMessage);
      
      // Set fallback rates if no data exists
      if (!rates) {
        setRates({
          kenig: { sell: 95.50, buy: 94.80, updated_at: new Date().toISOString() },
          bestchange: { sell: 95.30, buy: 94.90, updated_at: new Date().toISOString() },
          energo: { sell: 95.20, buy: 94.70, updated_at: new Date().toISOString() },
          timestamp: new Date().toISOString(),
          isFromDatabase: false,
          error: errorMessage
        });
      }
    } finally {
      setLoading(false);
    }
  }, [rates]);

  useEffect(() => {
    fetchRates();
    // Update every 30 seconds
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  return { rates, loading, error, lastUpdated, refetch: fetchRates };
}

// Enhanced kenig rate hook with better validation
export function useKenigRate() {
  const [rate, setRate] = useState<KenigRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/rates', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.kenig && data.kenig.sell && data.kenig.buy) {
        const kenigRate = {
          sell: Number(data.kenig.sell),
          buy: Number(data.kenig.buy),
          updated_at: data.kenig.updated_at || new Date().toISOString()
        };
        
        // Validate that rates are reasonable numbers
        if (kenigRate.sell > 0 && kenigRate.buy > 0 && kenigRate.sell > kenigRate.buy) {
          setRate(kenigRate);
          console.log('✅ Kenig rate updated successfully:', kenigRate);
        } else {
          throw new Error('Invalid rate values received');
        }
      } else {
        // Use fallback rate if no valid data
        console.warn('⚠️ No valid Kenig rate found, using fallback');
        setRate({
          sell: 95.50,
          buy: 94.80,
          updated_at: new Date().toISOString()
        });
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch kenig rate';
      console.error('❌ Error fetching Kenig rate:', errorMessage);
      setError(errorMessage);
      
      // Set fallback rate if no data exists
      if (!rate) {
        setRate({
          sell: 95.50,
          buy: 94.80,
          updated_at: new Date().toISOString()
        });
      }
    } finally {
      setLoading(false);
    }
  }, [rate]);

  useEffect(() => {
    fetchRate();
    // Update every 30 seconds
    const interval = setInterval(fetchRate, 30000);
    return () => clearInterval(interval);
  }, [fetchRate]);

  return { rate, loading, error, lastUpdated, refetch: fetchRate };
}