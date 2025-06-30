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
  isFallback?: boolean;
}

// Enhanced rates hook with better error handling and reduced update frequency
export function useAllRates() {
  const [rates, setRates] = useState<AllRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching rates from API...');
      
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
      console.log('📊 Received rates data:', data);
      
      // Validate that we have actual rate data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      // Check if this is fallback data
      if (data.isFallback) {
        console.warn('⚠️ Received fallback data from API');
        setError('Используются тестовые данные - проверьте подключение к базе данных');
      } else if (data.error) {
        console.warn('⚠️ API returned error:', data.error);
        setError(data.error);
      }
      
      // Ensure we have at least some valid rates
      const hasValidRates = (
        (data.kenig?.sell && data.kenig?.buy) ||
        (data.bestchange?.sell && data.bestchange?.buy) ||
        (data.energo?.sell && data.energo?.buy)
      );
      
      if (!hasValidRates && !data.isFallback) {
        console.warn('⚠️ No valid rates found in response:', data);
        setError('Нет актуальных курсов в базе данных');
      }
      
      setRates(data);
      setLastUpdated(new Date());
      
      if (hasValidRates && data.isFromDatabase) {
        console.log('✅ Successfully loaded rates from database');
        setError(null);
      }
      
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
          error: errorMessage,
          isFallback: true
        });
      }
    } finally {
      setLoading(false);
    }
  }, [rates]);

  useEffect(() => {
    fetchRates();
    // Увеличиваем интервал обновления до 2 минут для снижения нагрузки
    const interval = setInterval(fetchRates, 120000);
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
      
      console.log('🔄 Fetching Kenig rate from API...');
      
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
      console.log('📊 Received data for Kenig rate:', data);
      
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
          
          if (data.isFromDatabase) {
            setError(null);
          } else if (data.isFallback) {
            setError('Используются тестовые данные');
          }
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
        setError('Нет данных о курсах Kenig');
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
    // Увеличиваем интервал обновления до 2 минут
    const interval = setInterval(fetchRate, 120000);
    return () => clearInterval(interval);
  }, [fetchRate]);

  return { rate, loading, error, lastUpdated, refetch: fetchRate };
}