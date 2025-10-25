// hooks/useAssets.ts
import useSWR from 'swr';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

// 🔹 Валюты по умолчанию — если Supabase временно недоступен
const FALLBACK_BASES = [
  'USDT', 'RUB', 'USD', 'BTC', 'ETH', 'SOL', 'XRP', 'LTC', 'TRX', 'BNB'
] as const;

const FALLBACK_QUOTES_BY_BASE: Record<string, string[]> = {
  USDT: ['RUB', 'USD', 'BTC', 'ETH', 'SOL', 'XRP', 'LTC'],
  RUB:  ['USDT', 'BTC', 'ETH', 'USD'],
  USD:  ['USDT', 'BTC', 'ETH', 'RUB'],
  BTC:  ['USDT', 'RUB', 'ETH', 'SOL'],
  ETH:  ['USDT', 'RUB', 'BTC', 'SOL'],
  SOL:  ['USDT', 'RUB', 'BTC', 'ETH'],
  XRP:  ['USDT', 'RUB'],
  LTC:  ['USDT', 'RUB'],
  TRX:  ['USDT', 'RUB'],
  BNB:  ['USDT', 'RUB'],
};

// ============================================================
//  Вспомогательные функции
// ============================================================

/**
 * Получение всех доступных базовых валют из Supabase.
 */
const fetchBases = async (): Promise<string[]> => {
  if (!isSupabaseAvailable()) {
    console.warn('[useAssets] ⚠️ Supabase недоступен, возвращаю FALLBACK_BASES');
    return Array.from(FALLBACK_BASES);
  }

  try {
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('base')
      .not('base', 'is', null)
      .limit(1000);

    if (error) throw error;
    if (!data?.length) return Array.from(FALLBACK_BASES);

    const bases = [...new Set(data.map(r => r.base.toUpperCase()))].sort();
    console.log('[useAssets] ✅ Базовые валюты:', bases);
    return bases.length ? bases : Array.from(FALLBACK_BASES);
  } catch (err) {
    console.error('[useAssets] ❌ Ошибка в fetchBases:', err);
    return Array.from(FALLBACK_BASES);
  }
};

/**
 * Получение всех валют, доступных для обмена с выбранной базовой (base).
 * Теперь учитывает как прямые (base → quote), так и обратные (quote → base) пары.
 */
const fetchQuotes = async (base: string): Promise<string[]> => {
  if (!base || !isSupabaseAvailable()) {
    const fallback = FALLBACK_QUOTES_BY_BASE[base] || ['RUB', 'USDT'];
    console.warn(`[useAssets] ⚠️ Supabase недоступен, fallback quotes для ${base}:`, fallback);
    return fallback;
  }

  try {
    // --- Прямые пары base → quote
    const { data: direct, error: err1 } = await supabase
      .from('kenig_rates')
      .select('quote')
      .eq('base', base.toUpperCase())
      .not('quote', 'is', null);

    if (err1) console.warn(`[useAssets] ⚠️ Ошибка при загрузке прямых пар для ${base}:`, err1);

    // --- Обратные пары quote → base
    const { data: inverse, error: err2 } = await supabase
      .from('kenig_rates')
      .select('base')
      .eq('quote', base.toUpperCase())
      .not('base', 'is', null);

    if (err2) console.warn(`[useAssets] ⚠️ Ошибка при загрузке обратных пар для ${base}:`, err2);

    const directQuotes = (direct || []).map(r => r.quote.toUpperCase());
    const inverseQuotes = (inverse || []).map(r => r.base.toUpperCase());

    // --- Объединяем обе выборки
    const quotes = Array.from(new Set([...directQuotes, ...inverseQuotes])).sort();

    if (quotes.length > 0) {
      console.log(`[useAssets] ✅ Найдены валюты для ${base}:`, quotes);
      return quotes;
    }

    const fallback = FALLBACK_QUOTES_BY_BASE[base] || ['USDT', 'RUB'];
    console.warn(`[useAssets] ⚠️ Нет валют для ${base}, fallback:`, fallback);
    return fallback;
  } catch (err) {
    console.error(`[useAssets] ❌ Ошибка в fetchQuotes(${base}):`, err);
    const fallback = FALLBACK_QUOTES_BY_BASE[base] || ['USDT', 'RUB'];
    return fallback;
  }
};

// ============================================================
//  Основные хуки
// ============================================================

/**
 * Хук для базовых валют (левая часть калькулятора)
 */
export const useBaseAssets = () => {
  const { data, error, isLoading } = useSWR('bases', fetchBases, {
    refreshInterval: 5 * 60 * 1000, // каждые 5 мин
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000,
    fallbackData: Array.from(FALLBACK_BASES),
  });

  return {
    bases: data || Array.from(FALLBACK_BASES),
    loading: isLoading,
    error: error?.message ?? null,
  };
};

/**
 * Хук для валют, доступных для выбранной base (правая часть калькулятора)
 */
export const useQuoteAssets = (base: string) => {
  const { data, error, isLoading } = useSWR(
    base ? `quotes-${base}` : null,
    () => fetchQuotes(base),
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
      fallbackData: FALLBACK_QUOTES_BY_BASE[base] || ['USDT', 'RUB'],
    }
  );

  const quotes = data || (FALLBACK_QUOTES_BY_BASE[base] || ['USDT', 'RUB']);
  console.log(`[useQuoteAssets] base=${base}, quotes=`, quotes);

  return {
    quotes,
    loading: isLoading,
    error: error?.message ?? null,
  };
};

/**
 * Старый совместимый хук (для обратной совместимости)
 */
export function useAssets() {
  const { bases, loading: basesLoading, error: basesError } = useBaseAssets();

  return {
    assets: bases,
    loading: basesLoading,
    error: basesError,
  };
}