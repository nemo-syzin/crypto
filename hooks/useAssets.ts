import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface AssetData {
  base: string;
  quote: string;
}

/** Берём уникальный список валют из столбцов base и quote */
const fetchAssets = async (): Promise<string[]> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, using fallback assets');
    // Fallback список валют
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'].sort();
  }

  try {
    console.log('🔄 Fetching assets from exchange_rates table...');
    
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('source')
      .limit(1000); // 423 строк < 1000

    if (error) {
      console.error('❌ Error fetching assets:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No data found in exchange_rates table, using fallback');
      return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'].sort();
    }

    // Для таблицы exchange_rates у нас есть только источники (kenig, bestchange, energo)
    // Но мы знаем, что они работают с USDT/RUB парами
    const assets = ['USDT', 'RUB'].sort();
    
    console.log('✅ Successfully fetched assets:', assets);
    return assets;
    
  } catch (error) {
    console.error('❌ Error in fetchAssets:', error);
    // Возвращаем fallback данные при ошибке
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'].sort();
  }
};

export function useAssets() {
  const { data, error, isLoading } = useSWR('assets', fetchAssets, {
    refreshInterval: 5 * 60 * 1000, // обновляем раз в 5 мин
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    fallbackData: ['USDT', 'RUB'], // Базовые валюты как fallback
    onError: (error) => {
      console.warn('⚠️ Assets hook error, using fallback data:', error);
    },
  });

  return {
    assets: data ?? ['USDT', 'RUB'],
    loading: isLoading,
    error: error?.message ?? null
  };
}