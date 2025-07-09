import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

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
    // Сначала пробуем найти прямую пару (from/to)
    let { data, error } = await supabase
      .from('kenig_rates')
      .select('sell,buy,updated_at,source,base,quote')
      .eq('source', 'kenig')
      .eq('base', from)
      .eq('quote', to)
      .limit(1);

    // Если прямая пара не найдена, пробуем обратную пару (to/from)
    if (!data || data.length === 0) {
      const reverseQuery = await supabase
        .from('kenig_rates')
        .select('sell,buy,updated_at,source,base,quote')
        .eq('source', 'kenig')
        .eq('base', to)
        .eq('quote', from)
        .limit(1);
      
      if (reverseQuery.data && reverseQuery.data.length > 0) {
        data = reverseQuery.data;
        error = reverseQuery.error;
      }
    }
    
    if (error) {
      console.warn(`⚠️ Error fetching exchange rate for ${from}/${to}:`, error.message);
      throw new Error(`Ошибка загрузки курса: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error(`Курс для пары ${from}/${to} не найден`);
    }
    
    console.log(`✅ Found exchange rate for ${from}/${to}:`, data[0]);
    
    // Определяем, какой курс использовать (sell или buy) в зависимости от направления обмена
    const rateRow = data[0];
    
    // Определяем, какой курс использовать на основе того, какую валюту отдает пользователь
    const pickedRate = 
      fromCurrency === rateRow.quote ? Number(rateRow.sell) :
      fromCurrency === rateRow.base  ? Number(rateRow.buy)  :
      null;
    
    console.log(`🔄 Using ${fromCurrency === rateRow.quote ? 'SELL' : 'BUY'} rate for ${from}/${to}: ${pickedRate}`);
    
    return { 
      sell: pickedRate,
      buy: pickedRate,
      updated_at: rateRow.updated_at,
      pair: `${from}/${to}`, 
      source: rateRow.source 
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
          sell: 1.0,
          buy: 1.0,
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