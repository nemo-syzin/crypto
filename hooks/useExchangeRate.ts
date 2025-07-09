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
 */
const fetchExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<ExchangeRate> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, cannot fetch exchange rate');
    throw new Error('Supabase connection not available');
  }

  try {
    console.log(`🔄 Fetching exchange rate for ${fromCurrency}/${toCurrency}...`);
    
    // Пробуем найти прямую пару (fromCurrency/toCurrency)
    const { data: directData, error: directError } = await supabase
      .from('kenig_rates')
      .select('sell,buy,updated_at,source,base,quote')
      .eq('source', 'kenig')
      .eq('base', fromCurrency)
      .eq('quote', toCurrency)
      .limit(1);

    // Также пробуем найти обратную пару (toCurrency/fromCurrency)
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
    
    if (directData && directData.length > 0) {
      // Если есть прямая пара, используем ее
      rateRow = directData[0];
      error = directError;
      console.log(`✅ Found direct exchange rate for ${fromCurrency}/${toCurrency}:`, rateRow);
    } else if (reverseData && reverseData.length > 0) {
      // Если есть обратная пара, используем ее
      rateRow = reverseData[0];
      isReversePair = true;
      error = reverseError;
      console.log(`✅ Found reverse exchange rate for ${toCurrency}/${fromCurrency}:`, rateRow);
    } else {
      // Ищем альтернативные пары через промежуточную валюту (например, через USDT или RUB)
      const intermediaries = ['USDT', 'RUB', 'BTC', 'ETH'];
      
      for (const inter of intermediaries) {
        // Пропускаем, если промежуточная валюта совпадает с from или to
        if (inter === fromCurrency || inter === toCurrency) continue;
        
        console.log(`🔍 Trying to find rate through ${inter} for ${fromCurrency}/${toCurrency}...`);
        
        // Ищем пару fromCurrency -> inter
        const { data: firstLegData } = await supabase
          .from('kenig_rates')
          .select('sell,buy,updated_at,source,base,quote')
          .eq('source', 'kenig')
          .or(`base.eq.${fromCurrency},quote.eq.${fromCurrency}`)
          .or(`base.eq.${inter},quote.eq.${inter}`)
          .limit(10);
        
        // Ищем пару inter -> toCurrency
        const { data: secondLegData } = await supabase
          .from('kenig_rates')
          .select('sell,buy,updated_at,source,base,quote')
          .eq('source', 'kenig')
          .or(`base.eq.${inter},quote.eq.${inter}`)
          .or(`base.eq.${toCurrency},quote.eq.${toCurrency}`)
          .limit(10);
        
        if (firstLegData?.length > 0 && secondLegData?.length > 0) {
          console.log(`🔄 Found potential path through ${inter}: ${fromCurrency} -> ${inter} -> ${toCurrency}`);
          console.log(`First leg options:`, firstLegData);
          console.log(`Second leg options:`, secondLegData);
          
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
      console.warn(`⚠️ Error fetching exchange rate for ${fromCurrency}/${toCurrency}:`, error);
      throw new Error(`Ошибка загрузки курса: ${error?.message || 'Неизвестная ошибка'}`);
    }
    
    if (!rateRow) {
      throw new Error(`Курс для пары ${fromCurrency}/${toCurrency} не найден`);
    }
    
    // Определяем, какой курс использовать на основе направления обмена
    let pickedRate: number | null = null;
    
    if (isReversePair) {
      // Для обратной пары (toCurrency/fromCurrency)
      // Если отдаем fromCurrency, то это как покупка toCurrency (используем buy)
      // Если получаем toCurrency, то это как продажа fromCurrency (используем sell)
      pickedRate = Number(rateRow.buy);
    } else {
      // Для прямой пары (fromCurrency/toCurrency)
      // Если отдаем fromCurrency, то это как продажа fromCurrency (используем sell)
      // Если получаем toCurrency, то это как покупка fromCurrency (используем buy)
      pickedRate = Number(rateRow.sell);
    }
    
    // Проверяем, нужно ли инвертировать курс
    let finalRate = pickedRate;
    if (isReversePair) {
      // Для обратной пары нужно инвертировать курс
      finalRate = pickedRate && pickedRate !== 0 ? 1 / pickedRate : null;
    }
    
    console.log(`🔄 Using ${isReversePair ? 'BUY (inverted)' : 'SELL'} rate for ${fromCurrency}/${toCurrency}: ${finalRate} (${isReversePair ? 'inverted' : 'direct'})`);
    
    return { 
      sell: finalRate || 0,
      buy: finalRate || 0,
      updated_at: rateRow.updated_at,
      pair: `${fromCurrency}/${toCurrency}`, 
      source: rateRow.source 
    };
  } catch (error) {
    console.error(`❌ Error in fetchExchangeRate for ${fromCurrency}/${toCurrency}:`, error);
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