import { useState, useCallback, useRef, useEffect } from 'react';

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
      
      console.log('🔄 Fetching rates from API...');

      const response = await fetch('/api/rates-comparison', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        // Пытаемся получить детальное сообщение об ошибке с сервера
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.details) {
            errorMessage = errorData.details;
          }
        } catch (parseError) {
          // Если не удалось распарсить JSON, используем текст ответа
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = `HTTP ${response.status}: ${errorText.substring(0, 200)}`;
            }
          } catch (textError) {
            // Оставляем базовое сообщение об ошибке
            errorMessage = `HTTP error! status: ${response.status} (${response.statusText})`;
          }
        }
        
        // Special handling for configuration errors
        if (response.status === 500 && errorMessage.includes('configuration')) {
          errorMessage = 'Ошибка конфигурации: Проверьте настройки Supabase в файле .env.local';
        }
        
        throw new Error(errorMessage);
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
      
      if (hasValidRates && data.isFromDatabase) {
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
          kenig: { sell: 95.50, buy: 94.80, updated_at: new Date().toISOString() },
          bestchange: { sell: 95.30, buy: 94.90, updated_at: new Date().toISOString() },
          energo: { sell: 95.20, buy: 94.70, updated_at: new Date().toISOString() },
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
    
    // Настройка интервала обновления каждые 2 минуты для снижения нагрузки
    intervalRef.current = setInterval(() => {
      fetchRates();
    }, 120000); // Increased to 2 minutes to reduce server load

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

// Enhanced kenig rate hook with stable updates
export function useKenigRate() {
  const [rate, setRate] = useState<KenigRate | null>(null);
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
      
      console.log('🔄 Fetching Kenig rate from API...');

      const response = await fetch('/api/rates-comparison', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        // Пытаемся получить детальное сообщение об ошибке с сервера
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.details) {
            errorMessage = errorData.details;
          }
        } catch (parseError) {
          // Если не удалось распарсить JSON, используем текст ответа
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = `HTTP ${response.status}: ${errorText.substring(0, 200)}`;
            }
          } catch (textError) {
            // Оставляем базовое сообщение об ошибке
            errorMessage = `HTTP error! status: ${response.status} (${response.statusText})`;
          }
        }
        
        // Special handling for configuration errors
        if (response.status === 500 && errorMessage.includes('configuration')) {
          errorMessage = 'Ошибка конфигурации: Проверьте настройки Supabase в файле .env.local';
        }
        
        throw new Error(errorMessage);
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
          // Обновляем только если данные изменились
          setRate(prevRate => {
            if (!prevRate || 
                prevRate.sell !== kenigRate.sell || 
                prevRate.buy !== kenigRate.buy) {
              return kenigRate;
            }
            return prevRate;
          });
          
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
        if (!rate) {
          setRate({
            sell: 95.50,
            buy: 94.80,
            updated_at: new Date().toISOString()
          });
        }
        setError('Нет данных о курсах Kenig');
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch kenig rate';
      console.error('❌ Error fetching Kenig rate:', errorMessage);
      setError(errorMessage);
      
      // Set fallback rate only if no data exists
      if (!rate) {
        setRate({
          sell: 95.50,
          buy: 94.80,
          updated_at: new Date().toISOString()
        });
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [rate]);

  useEffect(() => {
    // Первоначальная загрузка
    fetchRate();
    
    // Настройка интервала обновления каждые 2 минуты для снижения нагрузки
    intervalRef.current = setInterval(() => {
      fetchRate();
    }, 120000); // Increased to 2 minutes to reduce server load

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