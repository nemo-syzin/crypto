import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

// Интерфейс для записей из таблицы kenig_rates
interface KenigRateRecord {
  id: number;
  source: string;
  base: string;
  quote: string;
  sell: number;
  buy: number;
  updated_at: string;
}

// Интерфейс для записей из таблицы exchange_rates
interface ExchangeRateRecord {
  id: number;
  source: string;
  currency_code: string;
  currency_name: string;
  sell: number;
  buy: number;
  updated_at: string;
}

// Общий интерфейс для возвращаемых курсов
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
    // Fallback курсы для популярных пар
    if (toCurrency === 'RUB') {
      // Курсы продажи криптовалют за рубли
      const fallbackRates: Record<string, {sell: number, buy: number}> = {
        'USDT': {sell: 95.50, buy: 94.80},
        'BTC': {sell: 2800000.00, buy: 2750000.00},
        'ETH': {sell: 180000.00, buy: 175000.00},
        'BNB': {sell: 25000.00, buy: 24500.00},
      };
      
      if (fallbackRates[fromCurrency]) {
        return {
          sell: fallbackRates[fromCurrency].sell,
          buy: fallbackRates[fromCurrency].buy,
          updated_at: new Date().toISOString(),
          pair: `${fromCurrency}/${toCurrency}`,
          source: 'fallback'
        };
      }
    } else if (fromCurrency === 'RUB') {
      // Курсы покупки криптовалют за рубли (инвертированные)
      const fallbackRates: Record<string, {sell: number, buy: number}> = {
        'USDT': {sell: 94.80, buy: 95.50},
        'BTC': {sell: 2750000.00, buy: 2800000.00},
        'ETH': {sell: 175000.00, buy: 180000.00},
        'BNB': {sell: 24500.00, buy: 25000.00},
      };
      
      if (fallbackRates[toCurrency]) {
        return {
          sell: Number((1 / fallbackRates[toCurrency].buy).toFixed(6)),
          buy: Number((1 / fallbackRates[toCurrency].sell).toFixed(6)),
          updated_at: new Date().toISOString(),
          pair: `${fromCurrency}/${toCurrency}`,
          source: 'fallback'
        };
      }
    }
    
    // Для пар криптовалюта/криптовалюта
    if (fromCurrency !== 'RUB' && toCurrency !== 'RUB') {
      return {
        sell: 1.02, // Примерный спред 2%
        buy: 0.98,
        updated_at: new Date().toISOString(),
        pair: `${fromCurrency}/${toCurrency}`,
        source: 'fallback'
      };
    }
    return null;
  }

  try {
    console.log(`🔄 Fetching exchange rate for ${fromCurrency}/${toCurrency}...`);

    // Проверяем таблицу exchange_rates (новая структура)
    const { data: exchangeData, error: exchangeError } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!exchangeError && exchangeData && exchangeData.length > 0) {
      console.log('✅ Found data in exchange_rates table:', exchangeData.length, 'records');
      
      // Находим курсы для fromCurrency и toCurrency
      const fromRate = exchangeData.find(rate => rate.currency_code === fromCurrency);
      const toRate = exchangeData.find(rate => rate.currency_code === toCurrency);
      
      if (fromRate && toRate) {
        console.log(`✅ Found rates for ${fromCurrency} and ${toCurrency} in exchange_rates`);
        
        // Если одна из валют RUB
        if (fromCurrency === 'RUB') {
          // Покупка криптовалюты за рубли
          return {
            sell: Number((1 / toRate.buy).toFixed(6)),
            buy: Number((1 / toRate.sell).toFixed(6)),
            updated_at: toRate.updated_at,
            pair: `${fromCurrency}/${toCurrency}`,
            source: 'kenig'
          };
        } else if (toCurrency === 'RUB') {
          // Продажа криптовалюты за рубли
          return {
            sell: Number(fromRate.sell),
            buy: Number(fromRate.buy),
            updated_at: fromRate.updated_at,
            pair: `${fromCurrency}/${toCurrency}`,
            source: 'kenig'
          };
        } else {
          // Обмен криптовалюты на криптовалюту через RUB
          // Продаем fromCurrency за RUB, затем покупаем toCurrency за RUB
          const sellToRub = Number(fromRate.sell);
          const buyFromRub = Number(toRate.buy);
          
          return {
            sell: Number((sellToRub / buyFromRub).toFixed(6)),
            buy: Number((fromRate.buy / toRate.sell).toFixed(6)),
            updated_at: new Date(Math.min(
              new Date(fromRate.updated_at).getTime(),
              new Date(toRate.updated_at).getTime()
            )).toISOString(),
            pair: `${fromCurrency}/${toCurrency}`,
            source: 'kenig'
          };
        }
      }
    }
    
    // Проверяем старую структуру таблицы exchange_rates (для совместимости)
    if ((fromCurrency === 'USDT' && toCurrency === 'RUB') || (fromCurrency === 'RUB' && toCurrency === 'USDT')) {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .eq('source', 'kenig')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.warn('⚠️ Error fetching from old exchange_rates structure:', error);
      } else if (data && data.length > 0) {
        const rateData = data[0];
        
        // Проверяем наличие старых полей
        if (rateData.usdt_sell_rate !== undefined && rateData.usdt_buy_rate !== undefined) {
          console.log('✅ Found data in old exchange_rates structure');
          
          // Проверяем, что курсы валидны
          if (rateData.usdt_sell_rate > 0 && rateData.usdt_buy_rate > 0) {
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
        }
      }
    }
    
    // Проверяем таблицу kenig_rates
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
      console.warn('⚠️ Error fetching from kenig_rates:', error);
    } else if (data && data.length > 0) {
      const rateData = data[0] as KenigRateRecord;
      
      console.log(`✅ Found direct exchange rate for ${fromCurrency}/${toCurrency}:`, rateData);
      
      // Проверяем, что курсы валидны
      if (rateData.sell > 0 && rateData.buy > 0) {
        return {
          sell: Number(rateData.sell),
          buy: Number(rateData.buy),
          updated_at: rateData.updated_at,
          pair: `${fromCurrency}/${toCurrency}`,
          source: rateData.source
        };
      }
    }

    // Если прямой пары нет, пробуем обратную пару (quote/base)
    const { data: reverseData, error: reverseError } = await supabase
      .from('kenig_rates')
      .select('*')
      .eq('source', 'kenig')
      .eq('base', toCurrency)
      .eq('quote', fromCurrency)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (!reverseError && reverseData && reverseData.length > 0) {
      const reverseRate = reverseData[0] as KenigRateRecord;
      
      console.log(`✅ Found reverse exchange rate for ${toCurrency}/${fromCurrency}:`, reverseRate);
      
      // Проверяем, что курсы валидны
      if (reverseRate.sell > 0 && reverseRate.buy > 0) {
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

    // Если не нашли прямую или обратную пару, пробуем рассчитать кросс-курс через RUB
    if (fromCurrency !== 'RUB' && toCurrency !== 'RUB') {
      console.log(`🔄 Trying to calculate cross rate ${fromCurrency}/${toCurrency} via RUB`);
      
      // Получаем курс fromCurrency к RUB
      const { data: fromToRub, error: fromError } = await supabase
        .from('kenig_rates')
        .select('*')
        .eq('source', 'kenig')
        .eq('base', fromCurrency)
        .eq('quote', 'RUB')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      // Получаем курс toCurrency к RUB
      const { data: toToRub, error: toError } = await supabase
        .from('kenig_rates')
        .select('*')
        .eq('source', 'kenig')
        .eq('base', toCurrency)
        .eq('quote', 'RUB')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (!fromError && !toError && fromToRub && fromToRub.length > 0 && 
          toToRub && toToRub.length > 0) {
        
        const fromRate = fromToRub[0] as KenigRateRecord;
        const toRate = toToRub[0] as KenigRateRecord;
        
        // Проверяем, что курсы валидны
        if (fromRate.sell > 0 && fromRate.buy > 0 && 
            toRate.sell > 0 && toRate.buy > 0) {
          
          console.log(`✅ Calculated cross rate for ${fromCurrency}/${toCurrency} via RUB`);
          
          // Рассчитываем кросс-курс
          // Продаем fromCurrency за RUB, затем покупаем toCurrency за RUB
          return {
            sell: Number((fromRate.sell / toRate.buy).toFixed(6)),
            buy: Number((fromRate.buy / toRate.sell).toFixed(6)),
            updated_at: new Date(Math.min(
              new Date(fromRate.updated_at).getTime(),
              new Date(toRate.updated_at).getTime()
            )).toISOString(),
            pair: `${fromCurrency}/${toCurrency}`,
            source: 'kenig'
          };
        }
      }
    }
    
    console.warn(`⚠️ No exchange rate found for ${fromCurrency}/${toCurrency} in any table`);
    return null;
  } catch (error) {
    console.error('❌ Error in fetchExchangeRate:', error);
    
    // Возвращаем fallback для популярных пар
    if (toCurrency === 'RUB') {
      const fallbackRates: Record<string, {sell: number, buy: number}> = {
        'USDT': {sell: 95.50, buy: 94.80},
        'BTC': {sell: 2800000.00, buy: 2750000.00},
        'ETH': {sell: 180000.00, buy: 175000.00},
        'BNB': {sell: 25000.00, buy: 24500.00},
      };
      
      if (fallbackRates[fromCurrency]) {
        return {
          sell: fallbackRates[fromCurrency].sell,
          buy: fallbackRates[fromCurrency].buy,
          updated_at: new Date().toISOString(),
          pair: `${fromCurrency}/${toCurrency}`,
          source: 'fallback'
        };
      }
    } else if (fromCurrency === 'RUB') {
      const fallbackRates: Record<string, {sell: number, buy: number}> = {
        'USDT': {sell: 94.80, buy: 95.50},
        'BTC': {sell: 2750000.00, buy: 2800000.00},
        'ETH': {sell: 175000.00, buy: 180000.00},
        'BNB': {sell: 24500.00, buy: 25000.00},
      };
      
      if (fallbackRates[toCurrency]) {
        return {
          sell: Number((1 / fallbackRates[toCurrency].buy).toFixed(6)),
          buy: Number((1 / fallbackRates[toCurrency].sell).toFixed(6)),
          updated_at: new Date().toISOString(),
          pair: `${fromCurrency}/${toCurrency}`,
          source: 'fallback'
        };
      }
    }
    
    // Для пар криптовалюта/криптовалюта
    if (fromCurrency !== 'RUB' && toCurrency !== 'RUB') {
      return {
        sell: 1.02, // Примерный спред 2%
        buy: 0.98,
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
    () => {
      // Не делаем запрос, если валюты одинаковые
      if (fromCurrency === toCurrency) {
        return {
          sell: 1,
          buy: 1,
          updated_at: new Date().toISOString(),
          pair: `${fromCurrency}/${toCurrency}`,
          source: 'system'
        };
      }
      return fetchExchangeRate(fromCurrency, toCurrency);
    },
    {
      refreshInterval: 30 * 1000, // обновляем каждые 30 секунд
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // предотвращаем частые повторные запросы
      onError: (error) => {
        console.warn('⚠️ Exchange rate hook error:', error);
      },
    }
  );

  return {
    rate: data,
    loading: isLoading,
    error: error ? (error.message || 'Ошибка загрузки курса') : null,
    lastUpdated: data ? new Date(data.updated_at) : null,
    refetch: mutate
  };
}