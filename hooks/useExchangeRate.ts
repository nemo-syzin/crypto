import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

// Интерфейс для строки из таблицы kenig_rates
interface RateRow {
  sell: number;
  buy: number;
  updated_at: string;
  source: string;
  base: string;
  quote: string;
}

// Интерфейс для строки из таблицы kenig_rates
interface RateRow {
  sell: number;
  buy: number;
  updated_at: string;
  source: string;
  base: string;
  quote: string;
}

interface ExchangeRate {
  sell: number;
  buy: number;
  updated_at: string;
  pair: string;
  source: string;
}

/**
 * Fetch exchange rate for a specific currency pair directly from kenig_rates table
 * This function has been enhanced to handle both direct and reverse pairs,
 * as well as to search for alternative paths when a direct pair is not available.
 */
const fetchExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<ExchangeRate> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, cannot fetch exchange rate');
    throw new Error('Supabase connection not available');
  }

  try {
    console.log(`🔄 Fetching exchange rate for ${fromCurrency}/${toCurrency}...`);
    
    // Шаг 1: Пробуем найти прямую пару (from/to)
    const { data: directData, error: directError } = await supabase
      .from('kenig_rates')
      .select('sell,buy,updated_at,source,base,quote')
      .eq('source', 'kenig')
      .eq('base', fromCurrency)
      .eq('quote', toCurrency)
      .limit(1);

    // Шаг 2: Пробуем найти обратную пару (to/from)
    const { data: reverseData, error: reverseError } = await supabase
        .from('kenig_rates')
        .select('sell,buy,updated_at,source,base,quote')
        .eq('source', 'kenig')
        .eq('base', toCurrency)
        .eq('quote', fromCurrency)
        .limit(1);

    // Проверяем, какие данные у нас есть
    let rateRow: RateRow | null = null;
    let isReversePair = false;
    let error = null;
    
    // Шаг 3: Определяем, какую пару использовать
    if (directData && directData.length > 0) {
      // Если есть прямая пара, используем ее
      rateRow = directData[0];
      error = directError;
      console.log(`✅ Found direct exchange rate for ${from}/${to}: ${rateRow.sell}/${rateRow.buy}`);
    } else if (reverseData && reverseData.length > 0) {
      // Если есть обратная пара, используем ее
      rateRow = reverseData[0];
      isReversePair = true;
      error = reverseError;
      console.log(`✅ Found reverse exchange rate for ${to}/${from}: ${rateRow.sell}/${rateRow.buy}`);
    } else {
      // Шаг 4: Ищем альтернативные пары через промежуточную валюту
      const intermediaries = ['USDT', 'RUB', 'BTC', 'ETH'];
      
      for (const inter of intermediaries) {
        // Пропускаем, если промежуточная валюта совпадает с from или to
        if (inter === fromCurrency || inter === toCurrency) continue;
        
        console.log(`🔍 Trying to find rate through ${inter} for ${fromCurrency}/${toCurrency}...`);
        
        // Ищем пару fromCurrency -> inter
        const { data: firstLegData, error: firstLegError } = await supabase
          .from('kenig_rates')
          .select('sell,buy,updated_at,source,base,quote')
          .eq('source', 'kenig')
          .or(`and(base.eq.${from},quote.eq.${inter}),and(base.eq.${inter},quote.eq.${from})`)
          .limit(10);
        
        // Ищем пару inter -> toCurrency
        const { data: secondLegData, error: secondLegError } = await supabase
          .from('kenig_rates')
          .select('sell,buy,updated_at,source,base,quote')
          .eq('source', 'kenig')
          .or(`and(base.eq.${inter},quote.eq.${to}),and(base.eq.${to},quote.eq.${inter})`)
          .limit(10);
        
        // Логируем результаты поиска для отладки
        if (firstLegError || secondLegError) {
          console.warn(`⚠️ Error searching for path through ${inter}:`, 
                      firstLegError || secondLegError);
          continue;
        }
        
        if (firstLegData?.length > 0 && secondLegData?.length > 0) {
          console.log(`🔄 Found potential path through ${inter}: ${fromCurrency} -> ${inter} -> ${toCurrency}`);
          console.log(`First leg options (${firstLegData.length}):`, 
                     firstLegData.map(r => `${r.base}/${r.quote}: ${r.sell}/${r.buy}`));
          console.log(`Second leg options (${secondLegData.length}):`, 
                     secondLegData.map(r => `${r.base}/${r.quote}: ${r.sell}/${r.buy}`));
          
          // Находим прямую пару fromCurrency -> inter
          const firstLeg = firstLegData.find(
            row => (row.base === fromCurrency && row.quote === inter) || (row.base === inter && row.quote === fromCurrency)
          );
          
          // Находим прямую пару inter -> toCurrency
          const secondLeg = secondLegData.find(
            row => (row.base === inter && row.quote === toCurrency) || (row.base === toCurrency && row.quote === inter)
          );
          
          if (firstLeg && secondLeg) {
            console.log(`✅ Found complete path through ${inter}!`);
            console.log(`First leg: ${firstLeg.base}/${firstLeg.quote}: ${firstLeg.sell}/${firstLeg.buy}`);
            console.log(`Second leg: ${secondLeg.base}/${secondLeg.quote}: ${secondLeg.sell}/${secondLeg.buy}`);
            
            // Используем первую найденную пару как основную
            // В будущем здесь можно реализовать расчет составного курса
            rateRow = firstLeg;
            // Проверяем, не обратная ли это пара
            isReversePair = (firstLeg.base === inter && firstLeg.quote === fromCurrency);
            break;
          }
        }
      }
    }
    
    if (error) {
      console.warn(`⚠️ Database error fetching exchange rate for ${from}/${to}:`, error);
      throw new Error(`Ошибка загрузки курса из базы данных: ${error?.message || 'Неизвестная ошибка'}`);
    }
    
    if (!rateRow) {
      throw new Error(`Курс для пары ${from}/${to} не найден в базе данных`);
    }
    
    // Шаг 5: Определяем, какой курс использовать на основе направления обмена
    let pickedRate: number | null = null;
    
    if (isReversePair) {
      // Для обратной пары (toCurrency/fromCurrency)
      // Для обратной пары нужно использовать обратный курс
      // Если мы продаем from, то это как покупка to у обменника (buy)
      pickedRate = Number(rateRow.buy); 
    } else {
      // Для прямой пары (fromCurrency/toCurrency)
      // Если мы продаем from, то это как продажа from обменнику (sell)
      pickedRate = Number(rateRow.sell); 
    }
    
    // Шаг 6: Проверяем, нужно ли инвертировать курс
    let finalRate = pickedRate;
    if (isReversePair) {
      // Для обратной пары нужно инвертировать курс
      finalRate = pickedRate && pickedRate !== 0 ? 1 / pickedRate : 0;
    }
    
    console.log(`🔄 Final rate for ${from}/${to}: ${finalRate} (${isReversePair ? 'inverted from ' + rateRow.base + '/' + rateRow.quote : 'direct'})`);
    
    return { 
      sell: finalRate || 0,
      buy: finalRate || 0,
      updated_at: rateRow.updated_at,
      pair: `${fromCurrency}/${toCurrency}`, 
      source: rateRow.source 
    };
  } catch (error) {
    console.error(`❌ Error in fetchExchangeRate for ${fromCurrency}/${toCurrency}:`, error);
    
    // Добавляем более информативное сообщение об ошибке
    if (error instanceof Error) {
      if (error.message.includes('JSON object requested')) {
        throw new Error(`Ошибка в базе данных: найдено несколько записей для пары ${from}/${to}. Проверьте уникальность записей.`);
      }
    }
    
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
      dedupingInterval: 5000,
      shouldRetryOnError: true,
      errorRetryCount: 2,
      onError: (error) => {
        console.warn('⚠️ Exchange rate hook error:', error);
      },
    }
  );

  return {
    rate: data,
    loading: isLoading,
    error: error ? (error.message || `Валютная пара ${fromCurrency}/${toCurrency} не поддерживается`) : null,
    lastUpdated: data ? new Date(data.updated_at) : null,
    refetch: mutate
  };
}