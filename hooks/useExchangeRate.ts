import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface ExchangeRateData {
  id: number;
  base: string;
  quote: string;
  sell_rate: number;
  buy_rate: number;
  updated_at: string;
}

interface ExchangeRate {
  sell: number;
  buy: number;
  updated_at: string;
  pair: string;
}

/** Получаем курс для конкретной валютной пары */
const fetchExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<ExchangeRate | null> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, using fallback rate');
    // Fallback курс только для USDT/RUB
    if ((fromCurrency === 'USDT' && toCurrency === 'RUB') || (fromCurrency === 'RUB' && toCurrency === 'USDT')) {
      return {
        sell: 95.50,
        buy: 94.80,
        updated_at: new Date().toISOString(),
        pair: `${fromCurrency}/${toCurrency}`
      };
    }
    return null;
  }

  try {
    console.log(`🔄 Fetching exchange rate for ${fromCurrency}/${toCurrency}...`);
    
    // Ищем прямую пару (например, USDT/RUB)
    let { data, error } = await supabase
      .from('kenig_rates')
      .select('*')
      .eq('base', fromCurrency)
      .eq('quote', toCurrency)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('❌ Error fetching exchange rate:', error);
      throw error;
    }

    // Если прямой пары нет, ищем обратную (например, RUB/USDT)
    if (!data || data.length === 0) {
      console.log(`🔄 Direct pair not found, trying reverse pair ${toCurrency}/${fromCurrency}...`);
      
      const { data: reverseData, error: reverseError } = await supabase
        .from('kenig_rates')
        .select('*')
        .eq('base', toCurrency)
        .eq('quote', fromCurrency)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (reverseError) {
        console.error('❌ Error fetching reverse exchange rate:', reverseError);
        throw reverseError;
      }

      if (reverseData && reverseData.length > 0) {
        const reverseRate = reverseData[0] as ExchangeRateData;
        // Инвертируем курсы для обратной пары
        return {
          sell: 1 / reverseRate.buy_rate,
          buy: 1 / reverseRate.sell_rate,
          updated_at: reverseRate.updated_at,
          pair: `${fromCurrency}/${toCurrency}`
        };
      }
    }

    if (!data || data.length === 0) {
      console.warn(`⚠️ No exchange rate found for ${fromCurrency}/${toCurrency}`);
      return null;
    }

    const rateData = data[0] as ExchangeRateData;
    
    console.log(`✅ Found exchange rate for ${fromCurrency}/${toCurrency}:`, rateData);
    
    return {
      sell: rateData.sell_rate,
      buy: rateData.buy_rate,
      updated_at: rateData.updated_at,
      pair: `${fromCurrency}/${toCurrency}`
    };
    
  } catch (error) {
    console.error('❌ Error in fetchExchangeRate:', error);
    
    // Возвращаем fallback только для USDT/RUB
    if ((fromCurrency === 'USDT' && toCurrency === 'RUB') || (fromCurrency === 'RUB' && toCurrency === 'USDT')) {
      return {
        sell: 95.50,
        buy: 94.80,
        updated_at: new Date().toISOString(),
        pair: `${fromCurrency}/${toCurrency}`
      };
    }
    
    return null;
  }
};

export function useExchangeRate(fromCurrency: string, toCurrency: string) {
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