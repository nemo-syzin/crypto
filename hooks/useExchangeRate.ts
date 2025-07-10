import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface ExchangeRate {
  sell: number;
  buy: number;
  updated_at: string;
  pair: string;
  source: string;
}

/**
 * Получаем курс из таблицы kenig_rates:
 *   • используем строки только source IN ('kenig','derived')
 *   • если прямой пары нет — берём обратную и инвертируем
 */
const fetchExchangeRate = async (from: string, to: string): Promise<ExchangeRate> => {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase connection not available');
  }

  const allowedSources = ['kenig', 'derived'];

  // ————— 1. Прямая пара
  const { data: direct, error: directErr } = await supabase
    .from('kenig_rates')
    .select('sell,buy,updated_at,source')
    .eq('base', from)
    .eq('quote', to)
    .in('source', allowedSources)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (directErr) console.warn(`⚠️ Supabase direct query error ${from}/${to}:`, directErr);

  if (direct) {
    return {
      sell: Number(direct.sell),
      buy:  Number(direct.buy),
      updated_at: direct.updated_at,
      pair: `${from}/${to}`,
      source: direct.source,
    };
  }

  // ————— 2. Обратная пара + инверсия
  const { data: rev, error: revErr } = await supabase
    .from('kenig_rates')
    .select('sell,buy,updated_at,source')
    .eq('base', to)
    .eq('quote', from)
    .in('source', allowedSources)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (revErr) console.warn(`⚠️ Supabase reverse query error ${to}/${from}:`, revErr);

  if (rev) {
    return {
      sell: Number((1 / rev.buy).toFixed(8)),  // покупка “to” за “from”
      buy:  Number((1 / rev.sell).toFixed(8)), // продажа “to” за “from”
      updated_at: rev.updated_at,
      pair: `${from}/${to}`,
      source: `${rev.source}_inverted`,
    };
  }

  throw new Error(`no rate for ${from}/${to}`);
};

export function useExchangeRate(fromCurrency: string, toCurrency: string) {
  const { data, error, isLoading, mutate } = useSWR(
    fromCurrency && toCurrency ? `exchange-rate-${fromCurrency}-${toCurrency}` : null,
    () => {
      if (fromCurrency === toCurrency) {
        return {
          sell: 1,
          buy: 1,
          updated_at: new Date().toISOString(),
          pair: `${fromCurrency}/${toCurrency}`,
          source: 'system',
        };
      }
      return fetchExchangeRate(fromCurrency, toCurrency);
    },
    {
      refreshInterval: 30_000,          // обновляем каждые 30 с
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5_000,
      shouldRetryOnError: false,
      onError: (err) => console.warn('⚠️ Exchange rate hook error:', err),
    },
  );

  return {
    rate: data,
    loading: isLoading,
    error: error ? (error.message || 'Валютная пара не поддерживается') : null,
    lastUpdated: data ? new Date(data.updated_at) : null,
    refetch: mutate,
  };
}