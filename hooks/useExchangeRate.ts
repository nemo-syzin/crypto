import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface DBRow {
  sell: number;
  buy: number;
  updated_at: string;
  base: string;
  quote: string;
  source: string;
}
interface Rate {
  rate: number;           // Уже готовый курс
  updated_at: string;
  pair: string;
  source: 'kenig' | 'derived';
}

const fetchExchangeRate = async (from: string, to: string): Promise<Rate> => {
  if (!isSupabaseAvailable()) throw new Error('supabase-off');

  // ① пробуем найти идеальную строку kenig
  const tryFetch = async (src: 'kenig' | 'derived') =>
    supabase
      .from<DBRow>('kenig_rates')
      .select('*')
      .eq('source', src)
      .in('base', [from, to])
      .in('quote', [from, to])
      .limit(1)
      .maybeSingle();

  let { data, error } = await tryFetch('kenig');
  if (error || !data) ({ data, error } = await tryFetch('derived'));
  if (error || !data) throw new Error(`no rate for ${from}/${to}`);

  // ② определяем направление
  const isDirect = data.base === from && data.quote === to;
  const rate = isDirect ? data.buy : data.sell;

  return {
    rate,
    updated_at: data.updated_at,
    pair: `${from}/${to}`,
    source: data.source as 'kenig' | 'derived',
  };
};

export function useExchangeRate(from: string, to: string) {
  const { data, error, isLoading, mutate } = useSWR(
    from && to && from !== to ? `rate-${from}-${to}` : null,
    () => (from === to
      ? { rate: 1, updated_at: new Date().toISOString(), pair: `${from}/${to}`, source: 'system' }
      : fetchExchangeRate(from, to)),
    { refreshInterval: 30_000 }
  );

  return {
    rate: data?.rate ?? 0,
    loading: isLoading,
    error: error?.message ?? null,
    lastUpdated: data ? new Date(data.updated_at) : null,
    refetch: mutate,
  };
}