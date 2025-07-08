import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

/** Берём уникальный список валют из столбцов base и quote */
const fetchAssets = async (): Promise<string[]> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, using fallback assets');
    // Fallback список валют
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'].sort();
  }

  try {
    console.log('🔄 Fetching assets from exchange_rates and kenig_rates tables...');
    
    // Сначала получаем валюты из exchange_rates
    const { data: exchangeData, error: exchangeError } = await supabase
      .from('exchange_rates')
      .select('source')
      .limit(1000);

    if (exchangeError) {
      console.error('❌ Error fetching assets from exchange_rates:', exchangeError);
      // Продолжаем выполнение, чтобы попробовать получить данные из kenig_rates
    }
    
    // Затем получаем валюты из kenig_rates
    const { data: kenigData, error: kenigError } = await supabase
      .from('kenig_rates')
      .select('base, quote')
      .not('base', 'is', null)
      .not('quote', 'is', null)
      .limit(1000);

    if (kenigError) {
      console.error('❌ Error fetching assets from kenig_rates:', kenigError);
      
      // Если обе таблицы недоступны, возвращаем fallback
      if (exchangeError || !exchangeData || exchangeData.length === 0) {
        throw new Error('Failed to fetch assets from both tables');
      }
    }

    // Если нет данных ни в одной из таблиц, используем fallback
    if ((!kenigData || kenigData.length === 0) && 
        (!exchangeData || exchangeData.length === 0)) {
      console.warn('⚠️ No data found in either table, using fallback');
      return ['USDT', 'RUB'].sort();
    }

    // Извлекаем уникальные валюты из base и quote
    const assetsSet = new Set<string>();
    
    // Добавляем базовые валюты USDT и RUB
    assetsSet.add('USDT');
    assetsSet.add('RUB');
    
    // Добавляем валюты из kenig_rates, если они есть
    if (kenigData && kenigData.length > 0) {
      kenigData.forEach((row) => {
        if (row.base) assetsSet.add(row.base);
        if (row.quote) assetsSet.add(row.quote);
      });
    }
    
    const assets = Array.from(assetsSet).sort();
    
    console.log('✅ Successfully fetched assets:', assets);
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
    revalidateOnReconnect: true,
    fallbackData: ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'], // Базовые валюты как fallback
    onError: (error) => {
      console.warn('⚠️ Assets hook error, using fallback data:', error);
    },
  });

  return {
    assets: data ?? ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'],
    loading: isLoading,
    error: error?.message ?? null
  };
}