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
 * Возвращает курс для пары (from -> to) из одного источника.
 * Ищет ОДНОЙ выборкой обе ориентации: (base=FROM,quote=TO) и (base=TO,quote=FROM).
 * Если найдена прямая — берём buy. Если только обратная — берём 1/sell.
 */
async function queryRate(from: string, to: string, source?: Source): Promise<RateResult | null> {
  if (!isSupabaseAvailable()) throw new Error('Supabase is not configured');

  log(`Querying rate for ${from}/${to}`, { source });

  const A = up(from);
  const B = up(to);

  // Ищем обе ориентации одной выборкой
  let query = supabase
    .from('kenig_rates')
    .select('source,base,quote,buy,sell,updated_at')
    .or(`and(base.eq.${A},quote.eq.${B}),and(base.eq.${B},quote.eq.${A})`)
    .order('updated_at', { ascending: false });

  if (source) query = query.eq('source', source);

  const { data, error } = await query as unknown as { data: RateRow[] | null; error: any };

  if (error) {
    log('Supabase error:', error);
    return null;
  }
  if (!data || data.length === 0) return null;

  // Пробуем прямую запись (FROM/TO) — берём BUY
  const direct = data.find(r => r.base === A && r.quote === B && r.buy && Number(r.buy) > 0);
  if (direct) {
    log(`Found direct rate for ${A}/${B}:`, { rate: direct.buy, source: direct.source });
    return {
      rate: Number(direct.buy),
      source: direct.source,
      direction: 'direct',
      updated_at: direct.updated_at,
      pair: `${A}/${B}`,
    };
  }

  // Пробуем обратную запись (TO/FROM) — берём 1/SELL
  const inverse = data.find(r => r.base === B && r.quote === A && r.sell && Number(r.sell) > 0);
  if (inverse) {
    log(`Found inverse rate for ${A}/${B}:`, { rate: 1 / Number(inverse.sell), source: inverse.source });
    return {
      rate: 1 / Number(inverse.sell),
      source: inverse.source,
      direction: 'inverse',
      updated_at: inverse.updated_at,
      pair: `${A}/${B}`,
    };
  }

  return null;
}

/**
 * Получение курса с учётом приоритета источников.
 */
async function resolveRate(from: string, to: string): Promise<RateResult> {
  // 1) сначала пробуем по приоритетным источникам
  for (const src of PRIORITY) {
    log(`Trying source: ${src} for ${from}/${to}`);
    const hit = await queryRate(from, to, src);
    if (hit) {
      log(`Success with source: ${src}`, hit);
      return hit;
    }
  }
  // 2) если ничего не нашли — пробуем без фильтра по source (любой источник)
  log(`Trying any source for ${from}/${to}`);
  const any = await queryRate(from, to);
  if (any) {
    log(`Success with any source`, any);
    return any;
  }

  log(`No rate found for ${from}/${to}`);
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
    refreshInterval: 60_000, // Уменьшаем интервал обновления до 1 минуты
    dedupingInterval: 30_000, // Уменьшаем дедупликацию до 30 сек
    revalidateOnFocus: true, // Обновляем при фокусе на окне
    revalidateOnReconnect: true, // Обновляем при восстановлении соединения
    errorRetryCount: 3, // Количество повторных попыток при ошибке
    errorRetryInterval: 5000, // Интервал между повторными попытками
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