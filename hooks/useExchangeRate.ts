import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface KenigRateRecord {
  id: number;
  source: string;
  base: string;
  quote: string;
  sell: number;
  buy: number;
  updated_at: string;
}

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
    // Fallback курс только для популярных пар
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
    
    // Для USDT/RUB пары используем таблицу exchange_rates
    if ((fromCurrency === 'USDT' && toCurrency === 'RUB') || 
        (fromCurrency === 'RUB' && toCurrency === 'USDT')) {
      
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
        console.warn(`⚠️ No exchange rate found for USDT/RUB`);
        return null;
      }

      const rateData = data[0] as ExchangeRateRecord;
      
      // Проверяем, что курсы валидны
      if (!rateData.usdt_sell_rate || !rateData.usdt_buy_rate || 
          rateData.usdt_sell_rate <= 0 || rateData.usdt_buy_rate <= 0) {
        console.warn('⚠️ Invalid rate values:', rateData);
        return null;
      }
      
      // Для USDT/RUB: sell_rate - курс продажи USDT за RUB, buy_rate - курс покупки USDT за RUB
      if (fromCurrency === 'USDT' && toCurrency === 'RUB') {
        return {
          sell: Number(rateData.usdt_sell_rate),
          buy: Number(rateData.usdt_buy_rate),
          updated_at: rateData.updated_at,
          pair: `${fromCurrency}/${toCurrency}`,
          source: rateData.source
        };
      } else if (fromCurrency === 'RUB' && toCurrency === 'USDT') {
        // Для RUB/USDT инвертируем курсы
        return {
          sell: Number((1 / rateData.usdt_buy_rate).toFixed(6)),
          buy: Number((1 / rateData.usdt_sell_rate).toFixed(6)),
          updated_at: rateData.updated_at,
          pair: `${fromCurrency}/${toCurrency}`,
          source: rateData.source
        };
      }
    } 
    // Для остальных пар используем таблицу kenig_rates
    else {
      // Сначала пробуем найти прямую пару (base/quote)
      let { data, error } = await supabase
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

      // Если прямой пары нет, пробуем обратную пару (quote/base)
      if (!data || data.length === 0) {
        console.log(`🔄 Direct pair not found, trying reverse pair ${toCurrency}/${fromCurrency}...`);
        
        const { data: reverseData, error: reverseError } = await supabase
          .from('kenig_rates')
          .select('*')
          .eq('source', 'kenig')
          .eq('base', toCurrency)
          .eq('quote', fromCurrency)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (reverseError) {
          console.error('❌ Error fetching reverse exchange rate:', reverseError);
          throw reverseError;
        }

        if (reverseData && reverseData.length > 0) {
          const reverseRate = reverseData[0] as KenigRateRecord;
          
          // Проверяем, что курсы валидны
          if (!reverseRate.sell || !reverseRate.buy || 
              reverseRate.sell <= 0 || reverseRate.buy <= 0) {
            console.warn('⚠️ Invalid reverse rate values:', reverseRate);
            return null;
          }
          
          // Инвертируем курсы для обратной пары
          return {
            sell: Number((1 / reverseRate.buy).toFixed(6)),
            buy: Number((1 / reverseRate.sell).toFixed(6)),
            updated_at: reverseRate.updated_at,
            pair: `${fromCurrency}/${toCurrency}`,
            source: reverseRate.source
          };
        }
      }

      if (!data || data.length === 0) {
        console.warn(`⚠️ No exchange rate found for ${fromCurrency}/${toCurrency}`);
        return null;
      }

      const rateData = data[0] as KenigRateRecord;
      
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
        source: rateData.source
      };
    }
    
  } catch (error) {
    console.error('❌ Error in fetchExchangeRate:', error);
    
    // Возвращаем fallback только для популярных пар
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