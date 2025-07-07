import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface ExchangeRateRecord {
  id: number;
  source: string;
  usdt_sell_rate: number;
  usdt_buy_rate: number;
  updated_at: string;
}

interface ExchangeRate {
  sell: number;
  buy: number;
  updated_at: string;
  pair: string;
  source: string;
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
        pair: `${fromCurrency}/${toCurrency}`,
        source: 'fallback'
      };
    }
    return null;
  }

  try {
    console.log(`🔄 Fetching exchange rate for ${fromCurrency}/${toCurrency}...`);
    
    // Для таблицы exchange_rates поддерживаем только USDT/RUB пары
    if (!((fromCurrency === 'USDT' && toCurrency === 'RUB') || (fromCurrency === 'RUB' && toCurrency === 'USDT'))) {
      console.warn(`⚠️ Pair ${fromCurrency}/${toCurrency} not supported in exchange_rates table`);
      return null;
    }
    
    // Получаем курс от kenig (основной источник)
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .eq('source', 'kenig')
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

    const rateData = data[0] as ExchangeRateRecord;
    
    console.log(`✅ Found exchange rate for ${fromCurrency}/${toCurrency}:`, rateData);
    
    // Для USDT/RUB: sell_rate - курс продажи USDT за RUB, buy_rate - курс покупки USDT за RUB
    if (fromCurrency === 'USDT' && toCurrency === 'RUB') {
      return {
        sell: rateData.usdt_sell_rate,
        buy: rateData.usdt_buy_rate,
        updated_at: rateData.updated_at,
        pair: `${fromCurrency}/${toCurrency}`,
        source: rateData.source
      };
    } else if (fromCurrency === 'RUB' && toCurrency === 'USDT') {
      // Для RUB/USDT инвертируем курсы
      return {
        sell: 1 / rateData.usdt_buy_rate,
        buy: 1 / rateData.usdt_sell_rate,
        updated_at: rateData.updated_at,
        pair: `${fromCurrency}/${toCurrency}`,
        source: rateData.source
      };
    }
    
    return {
      sell: rateData.usdt_sell_rate,
      buy: rateData.usdt_buy_rate,
      updated_at: rateData.updated_at,
      pair: `${fromCurrency}/${toCurrency}`,
      source: rateData.source
    };
    
  } catch (error) {
    console.error('❌ Error in fetchExchangeRate:', error);
    
    // Возвращаем fallback только для USDT/RUB
    if ((fromCurrency === 'USDT' && toCurrency === 'RUB') || (fromCurrency === 'RUB' && toCurrency === 'USDT')) {
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