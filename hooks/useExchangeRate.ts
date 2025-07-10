import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface ExchangeRate {
  sell: number;
  buy: number;
  updated_at: string;
  pair: string;
  source: 'derived' | 'kenig';
}

/**
 * Получить курс для пары (base/quote) из таблицы kenig_rates
 * приоритет: 1) derived  2) kenig
 * для RUB⇄USDT — всегда kenig
 */
const fetchExchangeRate = async (base: string, quote: string): Promise<ExchangeRate> => {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase connection is not configured');
  }

  console.log(`🔄  Fetching rate ${base}/${quote}`);

  // --- какие источники запрашиваем
  const preferKenig = (base === 'USDT' && quote === 'RUB') ||
                      (base === 'RUB'  && quote === 'USDT');

  const sources = preferKenig ? ['kenig'] : ['derived', 'kenig'];

  // --- запрос без .single() (чтобы не ловить 406)
  const { data, error } = await supabase
    .from('kenig_rates')
    .select('sell,buy,updated_at,source')
    .in('source', sources)
    .eq('base',  base)
    .eq('quote', quote)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error(`no rate for ${base}/${quote}`);
  }

  // --- выбираем нужный источник
  const row =
    data.find(r => r.source === 'derived') ??
    data.find(r => r.source === 'kenig');

  if (!row) {
    throw new Error(`no acceptable source for ${base}/${quote}`);
  }

  return {
    ...row,
    pair:   `${base}/${quote}`,
    source: row.source as 'derived' | 'kenig',
  };
};

/**
 * React-хука для получения курса
 */
export function useExchangeRate(fromCurrency: string, toCurrency: string) {
  const { data, error, isLoading, mutate } = useSWR(
    fromCurrency && toCurrency ? `rate-${fromCurrency}-${toCurrency}` : null,
    () => {
      if (fromCurrency === toCurrency) {
        const now = new Date().toISOString();
        return {
          sell: 1,
          buy: 1,
          updated_at: now,
          pair: `${fromCurrency}/${toCurrency}`,
          source: 'derived' as const,
        };
      }
      return fetchExchangeRate(fromCurrency, toCurrency);
    },
    {
      refreshInterval: 30_000,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5_000,
      shouldRetryOnError: false,
      onError: (e) => console.warn('⚠️  useExchangeRate:', e),
    },
  );

  return {
    rate: data,
    loading: isLoading,
    error: error ? (error.message || 'Курс недоступен') : null,
    lastUpdated: data ? new Date(data.updated_at) : null,
    refetch: mutate,
  };
}