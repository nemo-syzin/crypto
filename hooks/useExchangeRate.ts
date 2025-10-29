// hooks/useExchangeRate.ts
import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

// Добавляем логирование для отладки
const DEBUG = process.env.NODE_ENV === 'development';

function log(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[useExchangeRate] ${message}`, data || '');
  }
}

type Direction = 'direct' | 'inverse';
type Source = 'kenig' | 'bestchange' | 'energo' | 'derived' | string;

interface RateRow {
  source: string;
  base: string;
  quote: string;
  buy: number | null;
  sell: number | null;
  updated_at: string;
}

interface RateResult {
  rate: number;                 // итоговый курс для пересчёта amount_from -> amount_to
  updated_at: string;
  pair: string;                 // "FROM/TO" в верхнем регистре
  source: Source;
  direction: Direction;         // direct = использовали buy; inverse = использовали 1/sell
}

// Приоритет источников — derived только в самом конце.
const PRIORITY: Source[] = ['kenig', 'bestchange', 'energo', 'derived'];

function up(s: string) { return (s || '').toUpperCase(); }

/**
 * Получение курса с учётом приоритета источников - ОПТИМИЗИРОВАННАЯ ВЕРСИЯ.
 * Делает ОДИН запрос вместо множественных последовательных запросов.
 */
async function resolveRate(from: string, to: string): Promise<RateResult> {
  if (!isSupabaseAvailable()) throw new Error('Supabase is not configured');

  log(`Resolving rate for ${from}/${to}`);

  const A = up(from);
  const B = up(to);

  // Делаем ОДИН запрос, получаем все подходящие записи
  const { data, error } = await supabase
    .from('kenig_rates')
    .select('source,base,quote,buy,sell,updated_at')
    .or(`and(base.eq.${A},quote.eq.${B}),and(base.eq.${B},quote.eq.${A})`)
    .order('updated_at', { ascending: false }) as unknown as { data: RateRow[] | null; error: any };

  if (error) {
    log('Supabase error:', error);
    throw new Error(`Database error: ${error.message}`);
  }

  if (!data || data.length === 0) {
    log(`No data found for ${from}/${to}`);
    throw new Error(`Курс для пары ${from}/${to} не найден`);
  }

  log(`Found ${data.length} records for ${from}/${to}`, { sources: [...new Set(data.map(r => r.source))] });

  // Обрабатываем результаты с учетом приоритета источников
  for (const src of PRIORITY) {
    // Пробуем прямую запись (FROM/TO) — берём BUY
    const direct = data.find(r => r.source === src && r.base === A && r.quote === B && r.buy && Number(r.buy) > 0);
    if (direct) {
      log(`Found direct rate from ${src}:`, { rate: direct.buy });
      return {
        rate: Number(direct.buy),
        source: direct.source,
        direction: 'direct',
        updated_at: direct.updated_at,
        pair: `${A}/${B}`,
      };
    }

    // Пробуем обратную запись (TO/FROM) — берём 1/SELL
    const inverse = data.find(r => r.source === src && r.base === B && r.quote === A && r.sell && Number(r.sell) > 0);
    if (inverse) {
      log(`Found inverse rate from ${src}:`, { rate: 1 / Number(inverse.sell) });
      return {
        rate: 1 / Number(inverse.sell),
        source: inverse.source,
        direction: 'inverse',
        updated_at: inverse.updated_at,
        pair: `${A}/${B}`,
      };
    }
  }

  // Если не нашли в приоритетных источниках, берем первую подходящую запись
  const direct = data.find(r => r.base === A && r.quote === B && r.buy && Number(r.buy) > 0);
  if (direct) {
    log(`Found direct rate from fallback source:`, { source: direct.source, rate: direct.buy });
    return {
      rate: Number(direct.buy),
      source: direct.source,
      direction: 'direct',
      updated_at: direct.updated_at,
      pair: `${A}/${B}`,
    };
  }

  const inverse = data.find(r => r.base === B && r.quote === A && r.sell && Number(r.sell) > 0);
  if (inverse) {
    log(`Found inverse rate from fallback source:`, { source: inverse.source, rate: 1 / Number(inverse.sell) });
    return {
      rate: 1 / Number(inverse.sell),
      source: inverse.source,
      direction: 'inverse',
      updated_at: inverse.updated_at,
      pair: `${A}/${B}`,
    };
  }

  log(`No valid rate found for ${from}/${to}`);
  throw new Error(`Курс для пары ${from}/${to} не найден`);
}

/**
 * Хук. Возвращает курс, источник и направление.
 * ВАЖНО: теперь "rate" всегда означает множитель для amount_from:
 *   - USDT→RUB: rate = BUY (RUB за 1 USDT)
 *   - RUB→USDT: rate = 1/SELL (USDT за 1 RUB)
 */
export function useExchangeRate(from: string, to: string) {
  const key = from && to && from !== to ? ['rate', up(from), up(to)] : null;

  log(`Hook called for ${from}/${to}`, { key });

  const fetcher = async () => {
    log(`Fetcher called for ${from}/${to}`);
    if (up(from) === up(to)) {
      log(`Same currency pair ${from}/${to}, returning 1`);
      return {
        rate: 1,
        updated_at: new Date().toISOString(),
        pair: `${up(from)}/${up(to)}`,
        source: 'system',
        direction: 'direct' as Direction,
      };
    }
    log(`Resolving rate for ${from}/${to}`);
    return resolveRate(from, to);
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR(key, fetcher, {
    refreshInterval: 30_000,
    dedupingInterval: 2_000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    loadingTimeout: 5000,
    keepPreviousData: true,
    fallbackData: undefined,
    onSuccess: (data) => {
      log(`SWR success for ${from}/${to}:`, data);
    },
    onError: (error) => {
      log(`SWR error for ${from}/${to}:`, error);
    },
  });

  log(`Hook returning for ${from}/${to}:`, {
    rate: data?.rate ?? 0,
    source: data?.source,
    loading: isLoading,
    error: error?.message
  });

  return {
    rate: data?.rate ?? 0,
    source: data?.source as Source | undefined,
    direction: data?.direction as Direction | undefined,
    lastUpdated: data ? new Date(data.updated_at) : null,
    loading: isLoading,
    refreshing: isValidating,
    error: error?.message ?? null,
    refetch: mutate,
  };
}