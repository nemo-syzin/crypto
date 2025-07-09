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
    // Пробуем найти прямую пару (from/to)
    const { data: directData, error: directError } = await supabase
      .from('kenig_rates')
      .select('sell,buy,updated_at,source,base,quote')
      .eq('source', 'kenig')
      .eq('base', from)
      .eq('quote', to)
      .limit(1);

    // Также пробуем найти обратную пару (to/from)
    const { data: reverseData, error: reverseError } = await supabase
        .from('kenig_rates')
        .select('sell,buy,updated_at,source,base,quote')
        .eq('source', 'kenig')
        .eq('base', to)
        .eq('quote', from)
        .limit(1);

    // Проверяем, какие данные у нас есть
    let rateRow: RateRow | null = null;
    let error = null;
    
    if (directData && directData.length > 0) {
      // Если есть прямая пара, используем ее
      rateRow = directData[0];
      error = directError;
      console.log(`✅ Found direct exchange rate for ${from}/${to}:`, rateRow);
    } else if (reverseData && reverseData.length > 0) {
      // Если есть обратная пара, используем ее
      rateRow = reverseData[0];
      error = reverseError;
      console.log(`✅ Found reverse exchange rate for ${to}/${from}:`, rateRow);
    } else {
      // Ищем альтернативные пары через промежуточную валюту (например, через USDT или RUB)
      const intermediaries = ['USDT', 'RUB', 'BTC', 'ETH'];
      
      for (const inter of intermediaries) {
        // Пропускаем, если промежуточная валюта совпадает с from или to
        if (inter === from || inter === to) continue;
        
        console.log(`🔍 Trying to find rate through ${inter} for ${from}/${to}...`);
        
        // Ищем пару from -> inter
        const { data: firstLegData } = await supabase
          .from('kenig_rates')
          .select('sell,buy,updated_at,source,base,quote')
          .eq('source', 'kenig')
          .or(`base.eq.${from},quote.eq.${from}`)
          .or(`base.eq.${inter},quote.eq.${inter}`)
          .limit(10);
        
        // Ищем пару inter -> to
        const { data: secondLegData } = await supabase
          .from('kenig_rates')
          .select('sell,buy,updated_at,source,base,quote')
          .eq('source', 'kenig')
          .or(`base.eq.${inter},quote.eq.${inter}`)
          .or(`base.eq.${to},quote.eq.${to}`)
          .limit(10);
        
        if (firstLegData?.length > 0 && secondLegData?.length > 0) {
          console.log(`🔄 Found potential path through ${inter}: ${from} -> ${inter} -> ${to}`);
          console.log(`First leg options:`, firstLegData);
          console.log(`Second leg options:`, secondLegData);
          
          // Находим прямую пару from -> inter
          const firstLeg = firstLegData.find(
            row => (row.base === from && row.quote === inter) || (row.base === inter && row.quote === from)
          );
          
          // Находим прямую пару inter -> to
          const secondLeg = secondLegData.find(
            row => (row.base === inter && row.quote === to) || (row.base === to && row.quote === inter)
          );
          
          if (firstLeg && secondLeg) {
            console.log(`✅ Found complete path through ${inter}!`);
            
            // Используем первую найденную пару как основную
            // В будущем здесь можно реализовать расчет составного курса
            rateRow = firstLeg;
            break;
          }
        }
      }
    }
    
    if (error) {
      console.warn(`⚠️ Error fetching exchange rate for ${from}/${to}:`, error);
      throw new Error(`Ошибка загрузки курса: ${error?.message || 'Неизвестная ошибка'}`);
    }
    
    if (!rateRow) {
      throw new Error(`Курс для пары ${from}/${to} не найден`);
    }
    
    // Определяем, какой курс использовать (sell или buy) в зависимости от направления обмена
    // Определяем, какой курс использовать на основе того, какую валюту отдает пользователь
    const pickedRate = 
      fromCurrency === rateRow.quote ? Number(rateRow.sell) :
      fromCurrency === rateRow.base  ? Number(rateRow.buy)  :
      null;
    
    // Если валюты в обратном порядке, инвертируем курс
    const isReversePair = (rateRow.base === to && rateRow.quote === from);
    const finalRate = isReversePair && pickedRate ? 1 / pickedRate : pickedRate;
    
    console.log(`🔄 Using ${fromCurrency === rateRow.quote ? 'SELL' : 'BUY'} rate for ${from}/${to}: ${finalRate} (${isReversePair ? 'inverted' : 'direct'})`);
    
    return { 
      sell: finalRate,
      buy: finalRate,
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
      dedupingInterval: 5000,
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