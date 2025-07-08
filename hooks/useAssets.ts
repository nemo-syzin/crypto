import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface AssetData {
  id: number;
  currency_code: string;
  currency_name?: string;
  sell: number;
  buy: number;
  updated_at: string;
}

/** Получаем список всех доступных валют из базы данных */
const fetchAssets = async (): Promise<string[]> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, using fallback assets');
    // Fallback список валют
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'].sort();
  }

  try {
    console.log('🔄 Fetching assets from database...');
    
    // Получаем все валюты из таблицы с курсами
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('currency_code, currency_name')
      .not('currency_code', 'is', null)
      .order('currency_code');

    if (error) {
      console.error('❌ Error fetching assets:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No currency data found, using fallback');
      return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC'].sort();
    }

    // Извлекаем уникальные коды валют
    const assets = [...new Set(data.map(item => item.currency_code))].filter(Boolean).sort();
    
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