import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface ExchangeRateRecord {
  id: number;
  currency_code: string;
  sell: number;
  buy: number;
  updated_at: string;
}

interface ExchangeRate {
  sell: number;
  buy: number;
  updated_at: string;
  pair: string;
  source: string;
}

/** Получаем курс для конкретной валюты */
const fetchExchangeRate = async (currencyCode: string): Promise<ExchangeRate | null> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, using fallback rate');
    // Fallback курс только для USDT
    if (currencyCode === 'USDT') {
      return {
        sell: 95.50,
        buy: 94.80,
        updated_at: new Date().toISOString(),
        pair: `${currencyCode}/RUB`,
        source: 'fallback'
      };
    }
    return null;
  }

  try {
    console.log(`🔄 Fetching exchange rate for ${currencyCode}...`);
    
    // Получаем курс для указанной валюты
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .eq('currency_code', currencyCode)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('❌ Error fetching exchange rate:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn(`⚠️ No exchange rate found for ${currencyCode}`);
      return null;
    }

    const rateData = data[0] as ExchangeRateRecord;
    
    console.log(`✅ Found exchange rate for ${currencyCode}:`, rateData);
    
    // Проверяем, что курсы валидны
    if (!rateData.sell || !rateData.buy || 
        rateData.sell <= 0 || rateData.buy <= 0) {
      console.warn('⚠️ Invalid rate values:', rateData);
      return null;
    }
    
    return {
      sell: Number(rateData.sell),
      buy: Number(rateData.buy),
      updated_at: rateData.updated_at,
      pair: `${currencyCode}/RUB`,
      source: 'database'
    };
    
  } catch (error) {
    console.error('❌ Error in fetchExchangeRate:', error);
    
    // Возвращаем fallback только для USDT
    if (currencyCode === 'USDT') {
      return {
        sell: 95.50,
        buy: 94.80,
        updated_at: new Date().toISOString(),
        pair: `${currencyCode}/RUB`,
        source: 'fallback'
      };
    }
    
    return null;
  }
};

export function useExchangeRate(currencyCode: string) {
  const { data, error, isLoading, mutate } = useSWR(
    currencyCode ? `exchange-rate-${currencyCode}` : null,
    () => fetchExchangeRate(currencyCode),
    {
      refreshInterval: 30 * 1000, // обновляем каждые 30 секунд
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        console.warn('⚠️ Exchange rate hook error:', error);
      },
    }
  );

  return {
    rate: data,
    loading: isLoading,
    error: error?.message ?? null,
    lastUpdated: data ? new Date(data.updated_at) : null,
    refetch: mutate
  };
}