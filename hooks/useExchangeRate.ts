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
  source: string; // Изменено на string для поддержки всех источников
  direction: 'direct' | 'inverse'; // Добавлено поле direction
}

const sources = ['kenig','bestchange','derived','energo'] as const; // Приоритет источников

async function pickLatest(from:string, to:string, source?:string): Promise<Rate | null> {
  // Приводим валюты к верхнему регистру для запросов
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  console.log(`  -> Attempting direct lookup for ${fromUpper}/${toUpper} from source: ${source || 'any'}`);
  
  // 1. Ищем прямую пару (from -> to) и используем buy курс (обменник покупает у нас FROM)
  let qDirect = supabase.from('kenig_rates')
    .select('source,base,quote,buy,sell,updated_at')
    .eq('base', fromUpper)
    .eq('quote', toUpper)
    .order('updated_at', { ascending:false })
    .limit(1);
  if (source) qDirect = qDirect.eq('source', source);
  
  const { data: directData, error: directError } = await qDirect;
  
  if (directError) {
    console.warn(`  -> Error during direct lookup for ${fromUpper}/${toUpper} from source ${source || 'any'}:`, directError);
    // Не выбрасываем ошибку, чтобы попробовать инверсную пару или следующий источник
  }

  if (directData?.length && Number(directData[0].buy) > 0) {
    console.log(`  -> Found direct rate: ${directData[0].buy} (source: ${directData[0].source})`);
    return { 
      rate: Number(directData[0].buy), 
      source: directData[0].source, 
      direction: 'direct', 
      updated_at: directData[0].updated_at,
      pair: `${fromUpper}/${toUpper}`
    };
  }
  
  console.log(`  -> Attempting inverse lookup for ${toUpper}/${fromUpper} from source: ${source || 'any'}`);
  
  // 2. Если прямая пара не найдена, ищем обратную пару (to -> from) и используем 1 / sell курс (обменник продает нам TO)
  let qInverse = supabase.from('kenig_rates')
    .select('source,base,quote,buy,sell,updated_at')
    .eq('base', toUpper)
    .eq('quote', fromUpper)
    .order('updated_at', { ascending:false })
    .limit(1);
  if (source) qInverse = qInverse.eq('source', source);
  
  const { data: inverseData, error: inverseError } = await qInverse;
  
  if (inverseError) {
    console.warn(`  -> Error during inverse lookup for ${toUpper}/${fromUpper} from source ${source || 'any'}:`, inverseError);
    // Не выбрасываем ошибку, чтобы следующий источник мог быть проверен
  }

  if (inverseData?.length && Number(inverseData[0].sell) > 0) {
    const invertedRate = 1 / Number(inverseData[0].sell);
    console.log(`  -> Found inverse rate: 1/${inverseData[0].sell} = ${invertedRate} (source: ${inverseData[0].source})`);
    return { 
      rate: invertedRate, 
      source: inverseData[0].source, 
      direction: 'inverse', 
      updated_at: inverseData[0].updated_at,
      pair: `${fromUpper}/${toUpper}`
    };
  }
  
  console.log(`  -> No rate found for ${fromUpper}/${toUpper} from source: ${source || 'any'}`);
  return null;
}

async function resolveRate(from:string, to:string, priority = sources): Promise<Rate | null> {
  console.log(`Attempting to resolve rate for ${from}/${to} with priority: ${priority.join(', ')}`);
  
  // 1. Пробуем источники по приоритету
  for (const s of priority) {
    try {
      const hit = await pickLatest(from, to, s);
      if (hit) {
        console.log(`Resolved rate for ${from}/${to} from source ${s}`);
        return hit;
      }
    } catch (e) {
      console.error(`Error picking latest from source ${s}:`, e);
      // Продолжаем к следующему источнику, если произошла ошибка с текущим
    }
  }
  
  // 2. Если ни один приоритетный источник не дал результата, пробуем без фильтра по source
  console.log(`No rate found with priority sources, attempting without source filter.`);
  try {
    const hit = await pickLatest(from, to); // Вызов pickLatest без указания source
    if (hit) {
      console.log(`Resolved rate for ${from}/${to} without specific source filter.`);
      return hit;
    }
  } catch (e) {
    console.error(`Error picking latest without source filter:`, e);
  }

  console.log(`Failed to resolve rate for ${from}/${to} after all attempts.`);
  return null;
}

async function fetchExchangeRate(from: string, to: string): Promise<Rate> {
  if (from === to) {
    return { rate: 1, updated_at: new Date().toISOString(), pair: `${from.toUpperCase()}/${to.toUpperCase()}`, source: 'system', direction: 'direct' };
  }
  
  const result = await resolveRate(from, to); // Используем новую функцию resolveRate
  
  if (!result) {
    throw new Error(`No exchange rate found for ${from}/${to}`);
  }
  
  return result;
}

export function useExchangeRate(from: string, to: string) {
  const { data, error, isLoading, mutate } = useSWR(
    from && to && from !== to ? `rate-${from}-${to}` : null,
    () => (from === to
      ? { rate: 1, updated_at: new Date().toISOString(), pair: `${from}/${to}`, source: 'system', direction: 'direct' }
      : fetchExchangeRate(from, to)),
    { 
      // Если валюты одинаковые, курс всегда 1
      refreshInterval: 120_000, // 2 минуты
      dedupingInterval: 60_000, // 1 минута
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