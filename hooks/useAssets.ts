import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface AssetData {
  base: string;
  quote: string;
}

/** Получаем уникальный список валют из столбцов base и quote */
const fetchAssets = async (): Promise<string[]> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, using fallback assets');
    // Fallback список валют
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC', 'ADA', 'DOT', 'SOL', 'MATIC', 'AVAX', 'XRP', 'DOGE', 'LTC', 'LINK'].sort();
  }

  try {
    console.log('🔄 Fetching assets from kenig_rates table...');
    
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('base, quote')
      .not('base', 'is', null)
      .not('quote', 'is', null)
      .limit(1000);

    if (error) {
      console.error('❌ Error fetching assets:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No data found in kenig_rates table, using fallback');
      return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'].sort();
    }

    // Извлекаем уникальные валюты из base и quote
    const assetsSet = new Set<string>();
    
    data.forEach((row: AssetData) => {
      if (row.base) assetsSet.add(row.base);
      if (row.quote) assetsSet.add(row.quote);
    });
    
    const assets = Array.from(assetsSet).sort();
    
    console.log('✅ Successfully fetched assets:', assets);
    return assets;
    
  } catch (error) {
    console.error('❌ Error in fetchAssets:', error);
    // Возвращаем fallback данные при ошибке
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC', 'ADA', 'DOT', 'SOL', 'MATIC', 'AVAX', 'XRP', 'DOGE', 'LTC', 'LINK'].sort();
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