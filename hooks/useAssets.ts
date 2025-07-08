import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

/** 
 * Берём уникальный список валют из таблиц exchange_rates и kenig_rates
 * Проверяем обе таблицы для максимальной совместимости
 */
const fetchAssets = async (): Promise<string[]> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, using fallback assets');
    // Fallback список валют
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'].sort();
  }

  try {
    console.log('🔄 Fetching assets from all available tables...');
    
    // Извлекаем уникальные валюты из всех таблиц
    const assetsSet = new Set<string>();
    
    // Добавляем базовые валюты USDT и RUB
    assetsSet.add('USDT');
    assetsSet.add('RUB');
    
    // 1. Проверяем новую структуру таблицы exchange_rates (currency_code)
    const { data: exchangeData, error: exchangeError } = await supabase
      .from('exchange_rates')
      .select('currency_code, currency_name')
      .limit(1000);

    if (exchangeError) {
      console.warn('⚠️ Error fetching from exchange_rates:', exchangeError);
    } else if (exchangeData && exchangeData.length > 0) {
      console.log('✅ Found data in exchange_rates table:', exchangeData.length, 'records');
      
      // Проверяем структуру первой записи
      const firstRecord = exchangeData[0];
      if (firstRecord.currency_code) {
        console.log('✅ Using currency_code structure in exchange_rates');
        
        // Добавляем все валюты из currency_code
        exchangeData.forEach(record => {
          if (record.currency_code) {
            assetsSet.add(record.currency_code);
          }
        });
      }
    }
    
    // 2. Проверяем старую структуру таблицы exchange_rates (source)
    const { data: oldExchangeData, error: oldExchangeError } = await supabase
      .from('exchange_rates')
      .select('source, usdt_sell_rate, usdt_buy_rate')
      .limit(10);

    if (!oldExchangeError && oldExchangeData && oldExchangeData.length > 0) {
      // Проверяем, есть ли поле usdt_sell_rate
      const hasOldStructure = oldExchangeData.some(record => 
        record.usdt_sell_rate !== undefined && record.usdt_buy_rate !== undefined);
      
      if (hasOldStructure) {
        console.log('✅ Found old structure in exchange_rates table');
        // Добавляем USDT и RUB для старой структуры
        assetsSet.add('USDT');
        assetsSet.add('RUB');
      }
    }
    
    // 3. Проверяем таблицу kenig_rates
    const { data: kenigData, error: kenigError } = await supabase
      .from('kenig_rates')
      .select('base, quote')
      .not('base', 'is', null)
      .not('quote', 'is', null)
      .limit(1000);

    if (kenigError) {
      console.warn('⚠️ Error fetching from kenig_rates:', kenigError);
    } else if (kenigData && kenigData.length > 0) {
      console.log('✅ Found data in kenig_rates table:', kenigData.length, 'records');
      
      // Добавляем валюты из kenig_rates
      kenigData.forEach((row) => {
        if (row.base) assetsSet.add(row.base);
        if (row.quote) assetsSet.add(row.quote);
      });
    }
    
    // Если не нашли никаких данных, добавляем базовые криптовалюты
    if (assetsSet.size <= 2) {
      ['BTC', 'ETH', 'BNB', 'USDC'].forEach(asset => assetsSet.add(asset));
    }
    
    const assets = Array.from(assetsSet).sort();
    
    console.log('✅ Final assets list:', assets);
    return assets;
  } catch (error) {
    console.error('❌ Error in fetchAssets:', error);
    // Возвращаем fallback данные при ошибке
    return ['USDT', 'RUB'].sort();
  }
};

export function useAssets() {
  const { data, error, isLoading } = useSWR('assets', fetchAssets, {
    refreshInterval: 5 * 60 * 1000, // обновляем раз в 5 мин
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData: ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'], // Базовые валюты как fallback
    onError: (error) => {
      console.warn('⚠️ Assets hook error, using fallback data:', error);
    },
    dedupingInterval: 60000, // Предотвращаем частые повторные запросы
  });

  return {
    assets: data && data.length > 0 ? data : ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'],
    loading: isLoading,
    error: error?.message ?? null
  };
}