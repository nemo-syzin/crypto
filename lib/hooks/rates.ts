import { useState, useEffect, useCallback } from 'react';
import { getValidatedKenigRates, type RateValidationResult } from '@/lib/supabase/validated-rates';

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

// Hook for all rates with 30s revalidation using validated rates
export function useAllRates() {
  const [rates, setRates] = useState<AllRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching rates using validated rates function...');
      const validationResult: RateValidationResult = await getValidatedKenigRates();
      
      // Initialize result with null values
      const result: AllRates = {
        kenig: { sell: null, buy: null },
        bestchange: { sell: null, buy: null },
        energo: { sell: null, buy: null },
        timestamp: new Date().toISOString(),
        isFromDatabase: validationResult.isFromDatabase,
        error: validationResult.error
      };

      // Map validated rates by source
      if (validationResult.hasValidRates) {
        validationResult.rates.forEach(rate => {
          if (rate.isValid) {
            const rateData = {
              sell: rate.sell,
              buy: rate.buy,
              updated_at: rate.updated_at
            };

            if (rate.source === 'kenig') {
              result.kenig = rateData;
            } else if (rate.source === 'bestchange') {
              result.bestchange = rateData;
            } else if (rate.source === 'energo') {
              result.energo = rateData;
            }
          }
        });
      }

      // Use the most recent timestamp from valid rates
      const validRates = validationResult.rates.filter(r => r.isValid);
      if (validRates.length > 0) {
        const timestamps = validRates.map(r => r.updated_at).filter(Boolean);
        if (timestamps.length > 0) {
          result.timestamp = timestamps.sort().reverse()[0];
        }
      }

      setRates(result);
      setLastUpdated(new Date());
      
      console.log('✅ Rates loaded successfully:', result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rates';
      setError(errorMessage);
      console.error('❌ Error fetching rates:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();

    // Set up 30-second interval
    const interval = setInterval(fetchRates, 30000);

    return () => clearInterval(interval);
  }, [fetchRates]);

  return {
    rates,
    loading,
    error,
    lastUpdated,
    refetch: fetchRates,
  };
}

// Hook for kenig rate specifically with 30s revalidation using validated rates
export function useKenigRate() {
  const [rate, setRate] = useState<KenigRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching KenigSwap rate using validated rates function...');
      const validationResult: RateValidationResult = await getValidatedKenigRates();
      
      if (validationResult.error) {
        throw new Error(validationResult.error);
      }

      // Find the kenig rate
      const kenigRate = validationResult.rates.find(r => r.source === 'kenig' && r.isValid);
      
      if (!kenigRate) {
        throw new Error('KenigSwap rates not found or invalid in database');
      }

      const result: KenigRate = {
        sell: kenigRate.sell,
        buy: kenigRate.buy,
        updated_at: kenigRate.updated_at
      };

      setRate(result);
      setLastUpdated(new Date());
      
      console.log('✅ KenigSwap rate loaded successfully:', result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch kenig rate';
      setError(errorMessage);
      console.error('❌ Error fetching kenig rate:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate();

    // Set up 30-second interval
    const interval = setInterval(fetchRate, 30000);

    return () => clearInterval(interval);
  }, [fetchRate]);

  return {
    rate,
    loading,
    error,
    lastUpdated,
    refetch: fetchRate,
  };
}