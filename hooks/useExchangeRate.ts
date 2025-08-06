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

  console.log(`🔄 Fetching exchange rate for ${from} -> ${to}`);

  // Шаг 1: Ищем прямую пару (from -> to)
  console.log(`🔍 Looking for direct pair: ${from}/${to}`);
  
  let { data: directPair, error: directError } = await supabase
    .from('kenig_rates')
    .select('*')
    .eq('base', from)
    .eq('quote', to)
    .eq('source', 'kenig')
    .maybeSingle();

  if (directError) {
    console.warn(`⚠️ Error fetching direct pair ${from}/${to}:`, directError);
  }

  if (directPair && directPair.buy && directPair.buy > 0) {
    // Для прямой пары: клиент отдает from (базовую валюту), получает to (котируемую)
    // Клиент продает базовую валюту, поэтому используем sell курс
    console.log(`✅ Found direct pair ${from}/${to}, using sell rate (client sells ${from}):`, directPair.sell);
    return {
      rate: directPair.sell,
      updated_at: directPair.updated_at,
      pair: `${from}/${to}`,
      source: 'kenig',
    };
  }

  // Шаг 2: Если прямая пара не найдена, ищем обратную пару (to -> from)
  console.log(`🔍 Direct pair not found, looking for reverse pair: ${to}/${from}`);
  
  let { data: reversePair, error: reverseError } = await supabase
    .from('kenig_rates')
    .select('*')
    .eq('base', to)
    .eq('quote', from)
    .eq('source', 'kenig')
    .maybeSingle();

  if (reverseError) {
    console.warn(`⚠️ Error fetching reverse pair ${to}/${from}:`, reverseError);
  }

  if (reversePair && reversePair.sell && reversePair.sell > 0) {
    // Для обратной пары: клиент отдает from (котируемую), получает to (базовую)
    // Клиент покупает базовую валюту, поэтому используем buy курс и инвертируем
    const invertedRate = 1 / reversePair.buy;
    console.log(`✅ Found reverse pair ${to}/${from}, using inverted buy rate (client buys ${to}): 1/${reversePair.buy} = ${invertedRate}`);
    
    return {
      rate: invertedRate,
      updated_at: reversePair.updated_at,
      pair: `${from}/${to}`,
      source: 'derived',
    };
  }

  // Шаг 3: Если ни прямая, ни обратная пара не найдены в kenig, пробуем другие источники
  console.log(`🔍 No kenig pairs found, trying other sources for ${from}/${to}`);
  
  // Пробуем прямую пару из других источников
  let { data: otherDirectPair, error: otherDirectError } = await supabase
    .from('kenig_rates')
    .select('*')
    .eq('base', from)
    .eq('quote', to)
    .in('source', ['bestchange', 'derived'])
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (otherDirectError) {
    console.warn(`⚠️ Error fetching other direct pair ${from}/${to}:`, otherDirectError);
  }

  if (otherDirectPair && otherDirectPair.buy && otherDirectPair.buy > 0) {
    console.log(`✅ Found direct pair from ${otherDirectPair.source}: ${from}/${to}, using sell rate:`, otherDirectPair.sell);
    return {
      rate: otherDirectPair.sell,
      updated_at: otherDirectPair.updated_at,
      pair: `${from}/${to}`,
      source: 'derived',
    };
  }

  // Пробуем обратную пару из других источников
  let { data: otherReversePair, error: otherReverseError } = await supabase
    .from('kenig_rates')
    .select('*')
    .eq('base', to)
    .eq('quote', from)
    .in('source', ['bestchange', 'derived'])
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (otherReverseError) {
    console.warn(`⚠️ Error fetching other reverse pair ${to}/${from}:`, otherReverseError);
  }

  if (otherReversePair && otherReversePair.sell && otherReversePair.sell > 0) {
    const invertedRate = 1 / otherReversePair.buy;
    console.log(`✅ Found reverse pair from ${otherReversePair.source}: ${to}/${from}, using inverted buy rate: 1/${otherReversePair.buy} = ${invertedRate}`);
    
    return {
      rate: invertedRate,
      updated_at: otherReversePair.updated_at,
      pair: `${from}/${to}`,
      source: 'derived',
    };
  }

  // Если ничего не найдено
  console.error(`❌ No exchange rate found for ${from}/${to} in any direction or source`);
  throw new Error(`no rate for ${from}/${to}`);
};

export function useExchangeRate(from: string, to: string) {
  const { data, error, isLoading, mutate } = useSWR(
    from && to && from !== to ? `rate-${from}-${to}` : null,
    () => (from === to
      ? { rate: 1, updated_at: new Date().toISOString(), pair: `${from}/${to}`, source: 'system' }
      : fetchExchangeRate(from, to)),
    { 
      refreshInterval: 30_000,
      revalidateOnFocus: false,
      dedupingInterval: 10_000,
    }
  );

  return {
    rate: data?.rate ?? 0,
    loading: isLoading,
    error: error?.message ?? null,
    lastUpdated: data ? new Date(data.updated_at) : null,
    refetch: mutate,
  };
}