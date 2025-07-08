import { useState, useEffect, useCallback, useRef } from 'react';

interface AllRatesData {
  [currencyCode: string]: {
    sell: number | null;
    buy: number | null;
    updated_at?: string;
  };
}

interface AllRates {
  rates: AllRatesData;
  timestamp: string;
  isFromDatabase: boolean;
  error?: string;
  isFallback?: boolean;
}

interface SingleRate {
  sell: number;
  buy: number;
  updated_at: string;
}

// Кэш для предотвращения лишних запросов
let ratesCache: { data: AllRates | null; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 секунд

// Enhanced rates hook with stable updates and caching
export function useAllRates() {
  const [rates, setRates] = useState<AllRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const fetchingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRates = useCallback(async (forceRefresh = false) => {
    // Предотвращаем множественные одновременные запросы
    if (fetchingRef.current && !forceRefresh) {
      console.log('🔄 Fetch already in progress, skipping...');
      return;
    }

    // Проверяем кэш
    const now = Date.now();
    if (!forceRefresh && ratesCache && (now - ratesCache.timestamp) < CACHE_DURATION) {
      console.log('📦 Using cached rates data');
      if (ratesCache.data && !rates) {
        setRates(ratesCache.data);
        setLastUpdated(new Date(ratesCache.timestamp));
        setLoading(false);
      }
      return;
    }

    fetchingRef.current = true;
    
    try {
      // Показываем загрузку только при первом запросе
      if (!rates) {
        setLoading(true);
      }
      setError(null);
      
      console.log('🔄 Fetching all rates from API...');
      
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
      
      // Обновляем кэш
      ratesCache = {
        data,
        timestamp: now
      };
      
      // Обновляем состояние только если данные действительно изменились
      setRates(prevRates => {
        if (!prevRates || JSON.stringify(prevRates) !== JSON.stringify(data)) {
          return data;
        }
        return prevRates;
      });
      
      setLastUpdated(new Date());
      
      if (data.isFromDatabase) {
        console.log('✅ Successfully loaded rates from database');
        setError(null);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rates';
      console.error('❌ Error fetching rates:', errorMessage);
      setError(errorMessage);
      
      // Set fallback rates only if no data exists
      if (!rates) {
        const fallbackData = {
          rates: {
            USDT: { sell: 95.50, buy: 94.80, updated_at: new Date().toISOString() },
            BTC: { sell: 2800000, buy: 2750000, updated_at: new Date().toISOString() },
            ETH: { sell: 180000, buy: 175000, updated_at: new Date().toISOString() }
          },
          timestamp: new Date().toISOString(),
          isFromDatabase: false,
          error: errorMessage,
          isFallback: true
        };
        
        setRates(fallbackData);
        ratesCache = {
          data: fallbackData,
          timestamp: now
        };
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [rates]);

  // Инициализация и настройка интервала
  useEffect(() => {
    // Первоначальная загрузка
    fetchRates();
    
    // Настройка интервала обновления каждые 30 секунд
    intervalRef.current = setInterval(() => {
      fetchRates();
    }, 30000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchRates]);

  // Функция для принудительного обновления
  const refetch = useCallback(() => {
    fetchRates(true);
  }, [fetchRates]);

  return { 
    rates, 
    loading, 
    error, 
    lastUpdated, 
    refetch 
  };
}

// Enhanced single currency rate hook
export function useKenigRate(currencyCode: string = 'USDT') {
  const [rate, setRate] = useState<SingleRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const fetchingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRate = useCallback(async (forceRefresh = false) => {
    // Предотвращаем множественные одновременные запросы
    if (fetchingRef.current && !forceRefresh) {
      return;
    }

    fetchingRef.current = true;
    
    try {
      // Показываем загрузку только при первом запросе
      if (!rate) {
        setLoading(true);
      }
      setError(null);
      
      console.log(`🔄 Fetching ${currencyCode} rate from API...`);
      
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
      console.log(`📊 Received data for ${currencyCode} rate:`, data);
      
      if (data.rates && data.rates[currencyCode] && data.rates[currencyCode].sell && data.rates[currencyCode].buy) {
        const currencyRate = {
          sell: Number(data.rates[currencyCode].sell),
          buy: Number(data.rates[currencyCode].buy),
          updated_at: data.rates[currencyCode].updated_at || new Date().toISOString()
        };
        
        // Validate that rates are reasonable numbers
        if (currencyRate.sell > 0 && currencyRate.buy > 0 && currencyRate.sell > currencyRate.buy) {
          // Обновляем только если данные изменились
          setRate(prevRate => {
            if (!prevRate || 
                prevRate.sell !== currencyRate.sell || 
                prevRate.buy !== currencyRate.buy) {
              return currencyRate;
            }
            return prevRate;
          });
          
          console.log(`✅ ${currencyCode} rate updated successfully:`, currencyRate);
          
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
        console.warn(`⚠️ No valid ${currencyCode} rate found, using fallback`);
        if (!rate) {
          setRate({
            sell: currencyCode === 'USDT' ? 95.50 : 100,
            buy: currencyCode === 'USDT' ? 94.80 : 98,
            updated_at: new Date().toISOString()
          });
        }
        setError(`Нет данных о курсах ${currencyCode}`);
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch ${currencyCode} rate`;
      console.error(`❌ Error fetching ${currencyCode} rate:`, errorMessage);
      setError(errorMessage);
      
      // Set fallback rate only if no data exists
      if (!rate) {
        setRate({
          sell: currencyCode === 'USDT' ? 95.50 : 100,
          buy: currencyCode === 'USDT' ? 94.80 : 98,
          updated_at: new Date().toISOString()
        });
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [rate, currencyCode]);

  useEffect(() => {
    // Первоначальная загрузка
    fetchRate();
    
    // Настройка интервала обновления каждые 30 секунд
    intervalRef.current = setInterval(() => {
      fetchRate();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchRate]);

  const refetch = useCallback(() => {
    fetchRate(true);
  }, [fetchRate]);

  return { 
    rate, 
    loading, 
    error, 
    lastUpdated, 
    refetch 
  };
}