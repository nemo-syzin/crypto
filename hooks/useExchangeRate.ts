import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

// Список источников, которые нужно исключить
const EXCLUDED_SOURCES = ['bestchange', 'energo'];

interface ExchangeRate {
  sell: number;
  buy: number;
  updated_at: string;
  pair: string;
  source: string;
}

/**
 * Fetch exchange rate for a specific currency pair directly from kenig_rates table
 */
const fetchExchangeRate = async (from: string, to: string): Promise<ExchangeRate> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, cannot fetch exchange rate');
    throw new Error('Supabase connection not available');
  }

  try {
    console.log(`🔄 Fetching exchange rate for ${from}/${to}...`);
    
    // For USDT-RUB and RUB-USDT pairs, specifically use source 'kenig'
    if ((from === 'USDT' && to === 'RUB') || (from === 'RUB' && to === 'USDT')) {
      const { data, error, count } = await supabase
        .from('kenig_rates')
        .select('sell,buy,updated_at')
        .eq('source', 'kenig')
        .eq('base', from)
        .eq('quote', to)
        .limit(1);

      if (error) {
        console.warn(`⚠️ Error fetching kenig exchange rate for ${from}/${to}:`, error.message);
        throw new Error(`Ошибка загрузки курса: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        throw new Error(`Курс для пары ${from}/${to} не найден`);
      }
      
      console.log(`✅ Found kenig exchange rate for ${from}/${to}:`, data[0]);
      
      return { 
        ...data[0], 
        pair: `${from}/${to}`, 
        source: 'kenig' 
      };
    }
    
    // Для всех остальных пар, исключаем нежелательные источники
    const query = supabase
      .from('kenig_rates')
      .select('sell,buy,updated_at')
      .eq('base', from)
      .eq('quote', to);
    
    // Добавляем фильтр для исключения нежелательных источников
    if (EXCLUDED_SOURCES.length > 0) {
      query.not('source', 'in', `(${EXCLUDED_SOURCES.join(',')})`);
    }
    
    const { data, error, count } = await query.limit(1);

    if (error) {
      console.warn(`⚠️ Error fetching exchange rate for ${from}/${to}:`, error.message);
      throw new Error(`Ошибка загрузки курса: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error(`Курс для пары ${from}/${to} не найден`);
    }
    
    console.log(`✅ Found exchange rate for ${from}/${to}:`, data[0]);
    
    return { 
      ...data[0], 
      pair: `${from}/${to}`, 
      source: 'kenig' 
    };
  } catch (error) {
    console.error(`❌ Error in fetchExchangeRate for ${from}/${to}:`, error);
    throw error;
  }
};

export function useExchangeRate(fromCurrency: string, toCurrency: string) {
  const { data, error, isLoading, mutate } = useSWR(
    fromCurrency && toCurrency ? `exchange-rate-${fromCurrency}-${toCurrency}` : null,
    () => {
      // If same currency, return rate of 1
      if (fromCurrency === toCurrency) {
        return {
          sell: 1,
          buy: 1,
          updated_at: new Date().toISOString(),
          pair: `${fromCurrency}/${toCurrency}`,
          source: 'system'
        };
      }
      
      // Otherwise fetch from database
      return fetchExchangeRate(fromCurrency, toCurrency);
    },
    {
      refreshInterval: 30 * 1000, // refresh every 30 seconds
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      onError: (error) => {
        console.warn('⚠️ Exchange rate hook error:', error);
      },
    }
  );

  return {
    rate: data,
    loading: isLoading,
    error: error ? (error.message || 'Валютная пара не поддерживается') : null,
    lastUpdated: data ? new Date(data.updated_at) : null,
    refetch: mutate
  };
}