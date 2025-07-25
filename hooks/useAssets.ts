import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

/**
 * Fetch all unique base currencies from kenig_rates table
 */
const fetchBases = async (): Promise<string[]> => {
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available, using fallback bases');
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC', 'ADA', 'DOT', 'XRP', 'SOL'].sort();
  }

  try {
    console.log('🔄 Fetching base currencies from kenig_rates table...');
    
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('base')
      .not('base', 'is', null);

    if (error) {
      console.warn('⚠️ Error fetching base currencies:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Found base currencies:', data.length, 'records');
      return [...new Set(data.map(r => r.base))].sort();
    }
    
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC', 'ADA', 'DOT', 'XRP', 'SOL'].sort();
  } catch (error) {
    console.error('❌ Error in fetchBases:', error);
    return ['USDT', 'RUB', 'BTC', 'ETH', 'BNB', 'USDC', 'ADA', 'DOT', 'XRP', 'SOL'].sort();
  }
};

/**
 * Fetch all available quote currencies for a specific base currency
 */
const fetchQuotes = async (base: string): Promise<string[]> => {
  if (!base || !isSupabaseAvailable()) {
    return [];
  }

  try {
    console.log(`🔄 Fetching quote currencies for base ${base}...`);
    
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('quote')
      .eq('base', base)
      .not('quote', 'is', null);

    if (error) {
      console.warn(`⚠️ Error fetching quote currencies for ${base}:`, error);
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log(`✅ Found ${data.length} quote currencies for ${base}`);
      return [...new Set(data.map(r => r.quote))].sort();
    }
    
    return [];
  } catch (error) {
    console.error(`❌ Error in fetchQuotes for ${base}:`, error);
    return [];
  }
};

// Export hooks for base and quote assets
export const useBaseAssets = () => {
  const { data, error, isLoading } = useSWR('bases', fetchBases, {
    refreshInterval: 10 * 60 * 1000, // refresh every 10 minutes
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  return {
    bases: data || [],
    loading: isLoading,
    error: error?.message ?? null
  };
};

export const useQuoteAssets = (base: string) => {
  const { data, error, isLoading } = useSWR(
    base ? `quotes-${base}` : null, 
    () => fetchQuotes(base),
    {
      refreshInterval: 10 * 60 * 1000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  return {
    quotes: data || [],
    loading: isLoading,
    error: error?.message ?? null
  };
};

// Keep the original useAssets for backward compatibility
function useAssets() {
  const { bases, loading: basesLoading, error: basesError } = useBaseAssets();
  
  return {
    assets: bases,
    loading: basesLoading,
    error: basesError
  };
}