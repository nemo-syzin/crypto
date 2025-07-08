import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

/**
 * Берём уникальный список валют из таблицы kenig_rates
 * Извлекаем все уникальные значения из полей base и quote
 */
const fetchAssets = async (): Promise<string[]> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, using fallback assets');
    // Fallback список валют
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC', 'ADA', 'DOT', 'XRP', 'SOL'].sort();
  }

  try {
    console.log('🔄 Fetching assets from kenig_rates table...');
    
    // Извлекаем уникальные валюты из всех таблиц
    const assetsSet = new Set<string>();
    
    // Добавляем базовые валюты USDT и RUB
    assetsSet.add('USDT');
    assetsSet.add('RUB');
    
    // Получаем все уникальные значения из полей base и quote
    const { data: baseData, error: baseError } = await supabase
      .from('kenig_rates')
      .select('base')
      .not('base', 'is', null);

    if (baseError) {
      console.warn('⚠️ Error fetching base currencies:', baseError);
    } else if (baseData && baseData.length > 0) {
      console.log('✅ Found base currencies:', baseData.length, 'records');
      
      // Добавляем все базовые валюты
      baseData.forEach(row => {
        if (row.base) {
          assetsSet.add(row.base);
        }
      });
    }
    
    const { data: quoteData, error: quoteError } = await supabase
      .from('kenig_rates')
      .select('quote')
      .not('quote', 'is', null);

    if (quoteError) {
      console.warn('⚠️ Error fetching quote currencies:', quoteError);
    } else if (quoteData && quoteData.length > 0) {
      console.log('✅ Found quote currencies:', quoteData.length, 'records');
      
      // Добавляем все котируемые валюты
      quoteData.forEach(row => {
        if (row.quote) {
          assetsSet.add(row.quote);
        }
      });
    }
    
    // Проверяем таблицу exchange_rates с новой структурой
    const { data: currencyData, error: currencyError } = await supabase
      .from('exchange_rates')
      .select('currency_code')
      .not('currency_code', 'is', null);

    if (currencyError) {
      console.warn('⚠️ Error fetching currency_code:', currencyError);
    } else if (currencyData && currencyData.length > 0) {
      console.log('✅ Found currency_code data:', currencyData.length, 'records');
      
      // Добавляем все валюты из currency_code
      currencyData.forEach(row => {
        if (row.currency_code) {
          assetsSet.add(row.currency_code);
        }
      });
    }
    
    // Если не нашли никаких данных, добавляем базовые криптовалюты
    if (assetsSet.size <= 2) {
      ['BTC', 'ETH', 'BNB', 'USDC', 'ADA', 'DOT', 'XRP', 'SOL', 'MATIC', 'AVAX', 
       'DOGE', 'SHIB', 'LTC', 'LINK', 'UNI', 'ATOM', 'XLM', 'TRX', 'FIL', 'NEAR'].forEach(asset => assetsSet.add(asset));
    }
    
    const assets = Array.from(assetsSet).sort();
    
    console.log('✅ Final assets list:', assets);
    return assets;
  } catch (error) {
    console.error('❌ Error in fetchAssets:', error);
    // Возвращаем fallback данные при ошибке
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC', 'ADA', 'DOT', 'XRP', 'SOL'].sort();
  }
};

export function useAssets() {
  const { data, error, isLoading } = useSWR('assets', fetchAssets, {
    refreshInterval: 10 * 60 * 1000, // обновляем раз в 10 мин
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    fallbackData: ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC', 'ADA', 'DOT', 'XRP', 'SOL'], // Расширенный список fallback
    onError: (error) => {
      console.warn('⚠️ Assets hook error, using fallback data:', error);
    },
    dedupingInterval: 60000, // Предотвращаем частые повторные запросы
  });

  return {
    assets: data && data.length > 0 ? data : ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC', 'ADA', 'DOT', 'XRP', 'SOL'],
    loading: isLoading,
    error: error?.message ?? null
  };
}