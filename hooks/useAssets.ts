import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

/** Получаем список всех доступных валют из базы данных */
const fetchAssets = async () => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase is not available, using fallback data');
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'].sort();
  }

  try {
    console.log('🔄 Fetching assets from database...');
    
    // Получаем уникальные валюты из столбцов base и quote
    // Получаем уникальные валюты из столбцов base и quote
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('base, quote')
      .not('base', 'is', null)
      .eq('source', 'kenig');

    if (error) {
      console.error('❌ Error fetching assets:', error);
      throw error;
    }

    if (!data || data.length === 0) { 
      console.warn('⚠️ No data found in kenig_rates table, using fallback');
      return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'].sort();
    }

    // Извлекаем уникальные валюты из столбцов base и quote
    const baseValues = data.map(item => item.base).filter(Boolean);
    const quoteValues = data.map(item => item.quote).filter(Boolean);
    
    // Объединяем и удаляем дубликаты
    const allCurrencies = [...baseValues, ...quoteValues];
    const assets = [...new Set(allCurrencies)].sort();
    
    // Объединяем и удаляем дубликаты
    const allCurrencies = [...baseValues, ...quoteValues];
    const assets = [...new Set(allCurrencies)].sort();
    
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