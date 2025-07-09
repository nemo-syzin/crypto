import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

export interface ExchangeRate {
  /** коэффициент пересчёта: 1 from → rate to */
  rate: number;
  updated_at: string;
  pair: string;
}

const fetchExchangeRate = async (
  from: string,
  to: string
): Promise<ExchangeRate | null> => {
  if (!isSupabaseAvailable() || !supabase) {
    throw new Error('Supabase not configured');
  }

  // 1. пытаемся найти прямую пару base = from, quote = to
  const { data: direct } = await supabase
    .from('kenig_rates')
    .select('sell,buy,updated_at')
    .eq('base', from)
    .eq('quote', to)
    .order('updated_at', { ascending: false })
    .limit(1);

  if (direct && direct.length) {
    const { buy, updated_at } = direct[0];
    if (!buy || buy <= 0) throw new Error(`Invalid BUY rate for ${from}/${to}`);
    return { rate: Number(buy), updated_at, pair: `${from}/${to}` };
  }

  // 2. если прямой нет – ищем обратную base = to, quote = from
  const { data: reverse } = await supabase
    .from('kenig_rates')
    .select('sell,updated_at')
    .eq('base', to)
    .eq('quote', from)
    .order('updated_at', { ascending: false })
    .limit(1);

  if (reverse && reverse.length) {
    const { sell, updated_at } = reverse[0];
    if (!sell || sell <= 0) throw new Error(`Invalid SELL rate for ${to}/${from}`);
    return { rate: Number(1 / sell), updated_at, pair: `${from}/${to}` };
  }

  throw new Error(`Курс для пары ${from}/${to} не найден в базе`);
};

export function useExchangeRate(fromCurrency: string, toCurrency: string) {
  const key =
    fromCurrency && toCurrency && fromCurrency !== toCurrency
      ? `rate-${fromCurrency}-${toCurrency}`
      : null;

  const { data, error, isLoading, mutate } = useSWR(key, () =>
    fetchExchangeRate(fromCurrency, toCurrency)
  );

  return {
    rate: data,                       // { rate, updated_at, pair }
    loading: isLoading,
    error: error ? error.message : null,
    refetch: mutate,
  };
}