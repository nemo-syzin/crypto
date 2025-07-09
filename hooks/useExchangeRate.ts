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
    // Return fallback rates for common pairs
    if (from === 'USDT' && to === 'RUB') {
      return {
        rate: 95.50,
        updated_at: new Date().toISOString(),
        pair: 'USDT/RUB'
      };
    }
    if (from === 'RUB' && to === 'USDT') {
      return {
        rate: 0.0105,
        updated_at: new Date().toISOString(),
        pair: 'RUB/USDT'
      };
    }
    if (from === 'USDT' && to === 'ADA') {
      return {
        rate: 2.78,
        updated_at: new Date().toISOString(),
        pair: 'USDT/ADA'
      };
    }
    if (from === 'ADA' && to === 'USDT') {
      return {
        rate: 0.35,
        updated_at: new Date().toISOString(),
        pair: 'ADA/USDT'
      };
    }
    throw new Error('Supabase not configured. Please check your environment variables in .env.local. This currency pair is not available in fallback mode.');
  }

  // 1. пытаемся найти прямую пару base = from, quote = to
  const { data: direct, error: directError } = await supabase
    .from('kenig_rates')
    .select('sell,buy,updated_at')
    .eq('base', from)
    .eq('quote', to)
    .order('updated_at', { ascending: false })
    .limit(1);

  if (directError) {
    console.error('Error fetching direct rate:', directError);
    throw new Error(`Database error: ${directError.message}`);
  }

  if (direct && direct.length) {
    const { buy, updated_at } = direct[0];
    if (!buy || buy <= 0 || isNaN(Number(buy))) {
      throw new Error(`Invalid BUY rate for ${from}/${to}`);
    }
    return { 
      rate: Number(buy), 
      updated_at, 
      pair: `${from}/${to}` 
    };
  }

  // 2. если прямой нет – ищем обратную base = to, quote = from
  const { data: reverse, error: reverseError } = await supabase
    .from('kenig_rates')
    .select('sell,updated_at')
    .eq('base', to)
    .eq('quote', from)
    .order('updated_at', { ascending: false })
    .limit(1);

  if (reverseError) {
    console.error('Error fetching reverse rate:', reverseError);
    throw new Error(`Database error: ${reverseError.message}`);
  }

  if (reverse && reverse.length) {
    const { sell, updated_at } = reverse[0];
    if (!sell || sell <= 0 || isNaN(Number(sell))) {
      throw new Error(`Invalid SELL rate for ${to}/${from}`);
    }
    return { 
      rate: Number(1 / sell), 
      updated_at, 
      pair: `${from}/${to}` 
    };
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