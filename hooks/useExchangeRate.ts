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
const fetchExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<ExchangeRate | null> => {
  if (!fromCurrency || !toCurrency) {
    return null;
  }
  
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, using fallback rate');
    
    // Fallback курсы для основных валют
    const fallbackRates: Record<string, { sell: number, buy: number }> = {
      'USDT': { sell: 95.50, buy: 94.80 },
      'BTC': { sell: 2800000, buy: 2750000 },
      'ETH': { sell: 180000, buy: 175000 },
      'BNB': { sell: 25000, buy: 24500 },
      'USDC': { sell: 95.30, buy: 94.70 }
    };
    
    if (fromCurrency !== 'RUB' && toCurrency === 'RUB' && fallbackRates[fromCurrency]) {
      return {
        sell: fallbackRates[fromCurrency].sell,
        buy: fallbackRates[fromCurrency].buy,
        updated_at: new Date().toISOString(),
        pair: `${fromCurrency}/${toCurrency}`,
        source: 'fallback'
      };
    } else if (fromCurrency === 'RUB' && toCurrency !== 'RUB' && fallbackRates[toCurrency]) {
      return {
        sell: 1 / fallbackRates[toCurrency].buy,
        buy: 1 / fallbackRates[toCurrency].sell,
        updated_at: new Date().toISOString(),
        pair: `${fromCurrency}/${toCurrency}`,
        source: 'fallback'
      };
    }
    return null;
  }

  try {
    console.log(`🔄 Fetching exchange rate for ${fromCurrency}/${toCurrency}...`);

    // Определяем, какую пару искать в базе данных
    let baseQuery, quoteQuery;
    let invertRate = false;

    if (fromCurrency !== 'RUB' && toCurrency === 'RUB') {
      // Продажа криптовалюты за рубли
      baseQuery = fromCurrency;
      quoteQuery = toCurrency;
    } else if (fromCurrency === 'RUB' && toCurrency !== 'RUB') {
      // Покупка криптовалюты за рубли (инвертируем курс)
      baseQuery = toCurrency;
      quoteQuery = fromCurrency;
      invertRate = true;
    } else {
      console.warn(`⚠️ Pair ${fromCurrency}/${toCurrency} not supported (must include RUB)`);
      return null;
    }

    // Получаем курс из базы данных
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('*')
      .eq('source', 'kenig')
      .eq('base', baseQuery)
      .eq('quote', quoteQuery)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('❌ Error fetching exchange rate:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn(`⚠️ No exchange rate found for ${baseQuery}/${quoteQuery}`);
      return null;
    }

    const rateData = data[0];
    
    console.log(`✅ Found exchange rate for ${baseQuery}/${quoteQuery}:`, rateData);
    
    // Проверяем, что курсы валидны
    if (!rateData.sell || !rateData.buy || 
        rateData.sell <= 0 || rateData.buy <= 0) {
      console.warn('⚠️ Invalid rate values:', rateData);
      return null;
    }
    
    if (invertRate) {
      // Инвертируем курсы для покупки криптовалюты за рубли
      return {
        sell: Number((1 / rateData.buy).toFixed(8)),
        buy: Number((1 / rateData.sell).toFixed(8)),
        updated_at: rateData.updated_at,
        pair: `${fromCurrency}/${toCurrency}`,
        source: 'database'
      };
    } else {
      // Прямые курсы для продажи криптовалюты за рубли
      return {
        sell: Number(rateData.sell),
        buy: Number(rateData.buy),
        updated_at: rateData.updated_at,
        pair: `${fromCurrency}/${toCurrency}`,
        source: 'database'
      };
    }
  } catch (error) {
    console.error('❌ Error in fetchExchangeRate:', error);
    
    // Fallback курсы для основных валют
    const fallbackRates: Record<string, { sell: number, buy: number }> = {
      'USDT': { sell: 95.50, buy: 94.80 },
      'BTC': { sell: 2800000, buy: 2750000 },
      'ETH': { sell: 180000, buy: 175000 },
      'BNB': { sell: 25000, buy: 24500 },
      'USDC': { sell: 95.30, buy: 94.70 }
    };
    
    if (fromCurrency !== 'RUB' && toCurrency === 'RUB' && fallbackRates[fromCurrency]) {
      return {
        sell: fallbackRates[fromCurrency].sell,
        buy: fallbackRates[fromCurrency].buy,
        updated_at: new Date().toISOString(),
        pair: `${fromCurrency}/${toCurrency}`,
        source: 'fallback'
      };
    } else if (fromCurrency === 'RUB' && toCurrency !== 'RUB' && fallbackRates[toCurrency]) {
      return {
        sell: 1 / fallbackRates[toCurrency].buy,
        buy: 1 / fallbackRates[toCurrency].sell,
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
    (fromCurrency && toCurrency) ? `exchange-rate-${fromCurrency}-${toCurrency}` : null,
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