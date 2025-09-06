// hooks/useExchangeRate.ts
import useSWR from 'swr';
import { supabase } from '@/lib/supabase/client';

type Source = 'kenig' | 'bestchange' | 'energo' | 'derived';

const SOURCE_PRIORITY: Source[] = ['kenig', 'bestchange', 'energo', 'derived'];
const FRESH_MS = 5 * 60 * 1000; // 5 минут

type Row = {
  source: Source | string;
  base: string;
  quote: string;
  sell: number | string | null;
  buy: number | string | null;
  updated_at: string;
};

export type RateMeta = {
  rate: number;                 // всегда: сколько TO за 1 FROM
  pair: string;                 // FROM/TO
  source: string;               // фактический источник
  used: 'direct-buy' | 'inverse-1/sell';
  updatedAt: Date;
};

async function fetchRate(from: string, to: string): Promise<RateMeta> {
  const FROM = from.toUpperCase();
  const TO = to.toUpperCase();

  if (FROM === TO) {
    return {
      rate: 1,
      pair: `${FROM}/${TO}`,
      source: 'system',
      used: 'direct-buy',
      updatedAt: new Date(),
    };
  }

  // 1) забираем все записи для обоих направлений одним запросом
  const { data, error } = await supabase
    .from('kenig_rates')
    .select('source,base,quote,sell,buy,updated_at')
    .in('base', [FROM, TO])
    .in('quote', [FROM, TO])
    .not('buy', 'is', null)      // на всякий
    .not('sell', 'is', null)
    .limit(4000);

  if (error) throw new Error(error.message || 'Supabase error');

  const rows: Row[] = (data || []).map((r) => ({
    ...r,
    base: String(r.base).toUpperCase(),
    quote: String(r.quote).toUpperCase(),
    source: String(r.source),
    sell: r.sell == null ? null : Number(r.sell),
    buy: r.buy == null ? null : Number(r.buy),
  }));

  const now = Date.now();

  // помощники
  const isFresh = (r: Row) => {
    const t = new Date(r.updated_at).getTime();
    return Number.isFinite(t) && now - t <= FRESH_MS;
  };

  // 2) разделим на прямые и обратные
  const direct = rows.filter((r) => r.base === FROM && r.quote === TO);
  const inverse = rows.filter((r) => r.base === TO && r.quote === FROM);

  // 3) отфильтруем по свежести; если совсем нет свежих — используем любые, но это крайний случай
  const pickList = (arr: Row[]) => {
    const fresh = arr.filter(isFresh);
    return fresh.length ? fresh : arr;
  };

  const directList = pickList(direct).filter((r) => r.buy && r.buy > 0);
  const inverseList = pickList(inverse).filter((r) => r.sell && r.sell > 0);

  // 4) сортировка по приоритету источника и по времени обновления
  const byPriorityAndTime = (a: Row, b: Row) => {
    const pa =
      SOURCE_PRIORITY.indexOf(a.source as Source) === -1
        ? 999
        : SOURCE_PRIORITY.indexOf(a.source as Source);
    const pb =
      SOURCE_PRIORITY.indexOf(b.source as Source) === -1
        ? 999
        : SOURCE_PRIORITY.indexOf(b.source as Source);
    if (pa !== pb) return pa - pb;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  };

  directList.sort(byPriorityAndTime);
  inverseList.sort(byPriorityAndTime);

  // 5) правило выбора:
  //    - если есть прямая страка — берем ее .buy (вы покупаете BASE у клиента)
  //    - иначе берем обратную и используем 1 / .sell (вы продаете BASE клиенту)
  const directHit = directList[0];
  if (directHit) {
    return {
      rate: Number(directHit.buy!),           // сколько TO за 1 FROM
      pair: `${FROM}/${TO}`,
      source: directHit.source,
      used: 'direct-buy',
      updatedAt: new Date(directHit.updated_at),
    };
  }

  const inverseHit = inverseList[0];
  if (inverseHit) {
    const rate = 1 / Number(inverseHit.sell!);
    return {
      rate,                                   // сколько TO за 1 FROM
      pair: `${FROM}/${TO}`,
      source: inverseHit.source,
      used: 'inverse-1/sell',
      updatedAt: new Date(inverseHit.updated_at),
    };
  }

  throw new Error(`Курс для пары ${FROM}/${TO} не найден`);
}

export function useExchangeRate(from: string, to: string) {
  const key = from && to ? ['rate', from.toUpperCase(), to.toUpperCase()] : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    () => fetchRate(from, to),
    {
      refreshInterval: 60_000,   // фоновое обновление
      dedupingInterval: 30_000,
      revalidateOnFocus: false,
    }
  );

  return {
    rate: data?.rate ?? 0,
    meta: data ?? null,
    loading: isLoading,
    refreshing: isValidating,
    error: error ? (error as Error).message : null,
    lastUpdated: data?.updatedAt ?? null,
    refetch: mutate,
  };
}