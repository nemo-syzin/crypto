import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface ExchangeRate {
  sell: number;
  buy: number;
  updated_at: string;
  pair: string;
  source: string;
}

/** Получаем курс для конкретной валютной пары */
const fetchExchangeRate = async (fromCurrency: string, toCurrency: string = 'RUB'): Promise<ExchangeRate | null> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, using fallback rate');
    // Fallback курс только для USDT/RUB
    if (fromCurrency === 'USDT' && toCurrency === 'RUB') {
      return {
        sell: 95.50,
        buy: 94.80,
        updated_at: new Date().toISOString(),
        pair: `${fromCurrency}/${toCurrency}`,
        source: 'fallback'
      };
    }
    return null;
  }

  try {
    console.log(`🔄 Fetching exchange rate for ${fromCurrency}/${toCurrency}...`);
    
    // Получаем курс для указанной пары валют
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('*')
      .eq('source', 'kenig')
      .eq('base', fromCurrency)
      .eq('quote', toCurrency)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('❌ Error fetching exchange rate:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn(`⚠️ No exchange rate found for ${fromCurrency}/${toCurrency}`);
      return null;
    }

    const rateData = data[0];
    
    console.log(`✅ Found exchange rate for ${fromCurrency}/${toCurrency}:`, rateData);
    
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
      pair: `${fromCurrency}/${toCurrency}`,
      source: 'database'
    };
    
  } catch (error) {
    console.error('❌ Error in fetchExchangeRate:', error);
    
    // Возвращаем fallback только для USDT
    if (fromCurrency === 'USDT' && toCurrency === 'RUB') {
      return {
        sell: 95.50,
        buy: 94.80,
        updated_at: new Date().toISOString(),
        pair: `${fromCurrency}/${toCurrency}`,
        source: 'fallback'
      };
    }
    
    return null;
  }
};

export function useExchangeRate(fromCurrency: string, toCurrency: string = 'RUB') {
  const { data, error, isLoading, mutate } = useSWR(
    fromCurrency && toCurrency ? `exchange-rate-${fromCurrency}-${toCurrency}` : null,
    () => fetchExchangeRate(fromCurrency, toCurrency),
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