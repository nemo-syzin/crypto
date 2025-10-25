import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

const FALLBACK_BASES = [
  'USDT', 'RUB', 'USD', 'BTC', 'ETH', 'SOL', 'XRP', 'LTC', 'TRX', 'BNB'
] as const;

const FALLBACK_QUOTES_BY_BASE: Record<string, string[]> = {
  USDT: ['RUB', 'USD', 'BTC', 'ETH', 'SOL', 'XRP', 'LTC'],
  RUB:  ['USDT', 'BTC', 'ETH', 'USD'],
  USD:  ['USDT', 'BTC', 'ETH', 'RUB'],
  BTC:  ['USDT', 'RUB', 'ETH', 'SOL'],
  ETH:  ['USDT', 'RUB', 'BTC', 'SOL'],
  SOL:  ['USDT', 'RUB', 'BTC', 'ETH'],
  XRP:  ['USDT', 'RUB'],
  LTC:  ['USDT', 'RUB'],
  TRX:  ['USDT', 'RUB'],
  BNB:  ['USDT', 'RUB'],
};

/**
 * Fetch all unique base currencies from kenig_rates table
 */
const fetchBases = async (): Promise<string[]> => {
  if (!isSupabaseAvailable()) {
    console.warn('[Assets] ⚠️ Supabase not available, using fallback bases');
    return Array.from(FALLBACK_BASES);
  }

  try {
    console.log('[Assets] 🔄 Fetching base currencies from kenig_rates table...');
    
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('base')
      .not('base', 'is', null)
      .limit(1000); // Уменьшаем лимит для быстрой загрузки

    if (error) {
      console.warn('[Assets] ⚠️ Error fetching base currencies:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      const bases = [...new Set(data.map(r => r.base.toUpperCase()))].sort();
      console.log('[Assets] ✅ bases length:', bases.length, 'records:', bases);
      return bases.length > 0 ? bases : Array.from(FALLBACK_BASES);
    }
    
    console.log('[Assets] ⚠️ No base currencies found, using fallback');
    return Array.from(FALLBACK_BASES);
  } catch (error) {
    console.error('[Assets] ❌ Error in fetchBases:', error);
    return Array.from(FALLBACK_BASES);
  }
};

/**
 * Fetch all available quote currencies for a specific base currency
 */
const fetchQuotes = async (base: string): Promise<string[]> => {
  if (!base || !isSupabaseAvailable()) {
    const fallback = FALLBACK_QUOTES_BY_BASE[base] || FALLBACK_QUOTES_BY_BASE['USDT'] || ['RUB'];
    console.log('[Assets] ⚠️ No base or Supabase unavailable, using fallback quotes for', base, ':', fallback);
    return fallback;
  }

  try {
    console.log(`[Assets] 🔄 Fetching quote currencies for base ${base}...`);
    
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('quote')
      .eq('base', base.toUpperCase())
      .not('quote', 'is', null)
      .limit(1000); // Уменьшаем лимит для быстрой загрузки

    if (error) {
      console.warn(`[Assets] ⚠️ Error fetching quote currencies for ${base}:`, error);
      throw error;
    }
    
    if (data && data.length > 0) {
      const quotes = [...new Set(data.map(r => r.quote.toUpperCase()))].sort();
      console.log(`[Assets] ✅ quotes length for ${base}:`, quotes.length, 'records:', quotes);
      return quotes.length > 0 ? quotes : (FALLBACK_QUOTES_BY_BASE[base] || ['RUB']);
    }
    
    const fallback = FALLBACK_QUOTES_BY_BASE[base] || ['RUB'];
    console.log(`[Assets] ⚠️ No quotes found for ${base}, using fallback:`, fallback);
    return fallback;
  } catch (error) {
    const fallback = FALLBACK_QUOTES_BY_BASE[base] || ['RUB'];
    console.error(`[Assets] ❌ Error in fetchQuotes for ${base}:`, error);
    return fallback;
  }
};

// Export hooks for base and quote assets
export const useBaseAssets = () => {
  const { data, error, isLoading } = useSWR('bases', fetchBases, {
    refreshInterval: 5 * 60 * 1000, // Уменьшаем до 5 минут
    revalidateOnFocus: false,
    revalidateOnReconnect: true, // Включаем обновление при восстановлении соединения
    dedupingInterval: 30000, // Уменьшаем дедупликацию
    fallbackData: Array.from(FALLBACK_BASES), // Always provide fallback
    onError: (error) => {
      console.error('[Assets] Base assets error:', error);
    },
  });

  return {
    bases: data || Array.from(FALLBACK_BASES),
    loading: isLoading,
    error: error?.message ?? null
  };
};

export const useQuoteAssets = (base: string) => {
  const { data, error, isLoading } = useSWR(
    base ? `quotes-${base}` : null,
    () => fetchQuotes(base),
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
      fallbackData: FALLBACK_QUOTES_BY_BASE[base] || ['RUB'],
      onError: (error) => {
        console.error(`[Assets] Quote assets error for ${base}:`, error);
      },
    }
  );

  const quotes = data || (FALLBACK_QUOTES_BY_BASE[base] || ['RUB']);
  console.log(`[useQuoteAssets] base=${base}, quotes=`, quotes);

  return {
    quotes,
    loading: isLoading,
    error: error?.message ?? null
  };
};

// Keep the original useAssets for backward compatibility
export function useAssets() {
  const { bases, loading: basesLoading, error: basesError } = useBaseAssets();
  
  return {
    assets: bases,
    loading: basesLoading,
    error: basesError
  };
}