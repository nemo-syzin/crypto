import type { SupabaseClient } from '@supabase/supabase-js';
import { getServerSupabaseClient, isServerSupabaseConfigured, getServerSupabaseStatus } from './server';

// Константы для пагинации
const PAGINATION_SIZE = 1000; // Размер страницы для пагинации
const MAX_TOTAL_RECORDS = 10000; // Максимальное количество записей для безопасности

export interface ValidatedKenigRate {
  id: number;
  source: string;
  sell: number;
  buy: number;
  updated_at: string;
  isValid: boolean;
  validationErrors: string[];
}

export interface RateValidationResult {
  rates: ValidatedKenigRate[];
  hasValidRates: boolean;
  totalRates: number;
  validRatesCount: number;
  invalidRatesCount: number;
  lastUpdated: Date;
  isFromDatabase: boolean;
  error?: string;
}

function isFinitePositiveNumber(value: unknown): { isValid: boolean; error?: string } {
  const numericValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (isNaN(numericValue) || !isFinite(numericValue)) {
    return { isValid: false, error: `value is not a valid number` };
  }
  if (numericValue <= 0) {
    return { isValid: false, error: `value must be greater than 0` };
  }
  return { isValid: true };
}

function validateRateRecord(rate: any): ValidatedKenigRate {
  const errors: string[] = [];

  const sellOk = isFinitePositiveNumber(rate?.sell);
  const buyOk = isFinitePositiveNumber(rate?.buy);

  if (!sellOk.isValid) errors.push(`sell: ${sellOk.error}`);
  if (!buyOk.isValid) errors.push(`buy: ${buyOk.error}`);

  const updated = rate?.updated_at ? new Date(rate.updated_at).toISOString() : new Date().toISOString();

  return {
    id: Number(rate?.id) || 0,
    source: String(rate?.source || 'unknown'),
    sell: sellOk.isValid ? Number(rate.sell) : 0,
    buy: buyOk.isValid ? Number(rate.buy) : 0,
    updated_at: updated,
    isValid: errors.length === 0,
    validationErrors: errors,
  };
}

/**
 * Читает все записи из таблицы `kenig_rates` или view `kenig_pairs_latest`, валидирует и возвращает агрегат.
 * ВАЖНО: клиент Supabase создаём здесь (внутри запроса), чтобы он привязался к Edge/Web fetch.
 */
export async function getValidatedKenigRates(): Promise<RateValidationResult> {
  const status = getServerSupabaseStatus();

  console.log('🔧 [Supabase] Configuration status:', {
    hasUrl: status.hasUrl,
    hasAnon: status.hasAnon,
    hasService: status.hasService,
    url: status.url?.substring(0, 30) + '...',
    isConfigured: isServerSupabaseConfigured()
  });

  if (!isServerSupabaseConfigured()) {
    const errorMsg = `Supabase configuration issue: URL=${status.hasUrl ? 'OK' : 'MISSING'}, ANON=${status.hasAnon ? 'OK' : 'MISSING'}`;
    console.error('❌ [Supabase] Configuration error:', errorMsg);
    
    return {
      rates: [],
      hasValidRates: false,
      totalRates: 0,
      validRatesCount: 0,
      invalidRatesCount: 0,
      lastUpdated: new Date(),
      isFromDatabase: false,
      error: errorMsg,
    };
  }

  // Создаём клиент Supabase с увеличенным таймаутом
  console.log('🔄 [Supabase] Creating client...');
  const supabase: SupabaseClient = getServerSupabaseClient({ useServiceRole: false, timeoutMs: 15000 });
  console.log('✅ [Supabase] Client created successfully');

  try {
    // Пользователь явно запросил не использовать view, используем полную таблицу с пагинацией
    console.warn('⚠️ [Supabase] User explicitly requested to not use view, fetching all records with pagination.');
    console.log('🔄 [Supabase] Querying kenig_rates table with pagination...');

    const paginationStartTime = Date.now();
    const allData: any[] = [];
    let from = 0;
    let hasMoreData = true;
    let pageCount = 0;

    while (hasMoreData && allData.length < MAX_TOTAL_RECORDS) {
      const to = from + PAGINATION_SIZE - 1;
      console.log(`🔍 [Supabase] Fetching page ${pageCount + 1}: range(${from}, ${to})`);

      const { data: pageData, error: pageError } = await supabase
        .from('kenig_rates') // Используем напрямую таблицу kenig_rates
        .select('*')
        .not('base', 'is', null)
        .not('quote', 'is', null)
        .not('source', 'is', null)
        .order('updated_at', { ascending: false })
        .range(from, to);

      if (pageError) {
        console.error('❌ [Supabase] Pagination error:', pageError);
        throw pageError;
      }

      if (!pageData || pageData.length === 0) {
        console.log('📄 [Supabase] No more data, stopping pagination');
        hasMoreData = false;
        break;
      }

      allData.push(...pageData);
      console.log(`📊 [Supabase] Page ${pageCount + 1} loaded: ${pageData.length} records (total: ${allData.length})`);

      // Если получили меньше записей, чем размер страницы, значит это последняя страница
      if (pageData.length < PAGINATION_SIZE) {
        console.log('📄 [Supabase] Last page reached');
        hasMoreData = false;
      } else {
        from = to + 1;
        pageCount++;
      }

      // Защита от бесконечного цикла
      if (pageCount > 50) { // Ограничиваем количество страниц для безопасности
        console.warn('⚠️ [Supabase] Too many pages, stopping pagination for safety');
        hasMoreData = false;
      }
    }

    const data = allData; // Все собранные данные
    const queryDuration = Date.now() - paginationStartTime;

    console.log(`✅ [Supabase] Pagination completed: ${allData.length} total records in ${pageCount + 1} pages`);

    if (!data || data.length === 0) {
      console.warn('⚠️ [Supabase] No data found in kenig_rates table');
      console.log('🔍 [Supabase] Table might be empty or all records have NULL values in required fields');
      return {
        rates: [],
        hasValidRates: false,
        totalRates: 0,
        validRatesCount: 0,
        invalidRatesCount: 0,
        lastUpdated: new Date(),
        isFromDatabase: true,
        error: 'No exchange rate data found in kenig_rates table',
      };
    }

    console.log('📊 [Supabase] Raw data received:', {
      recordCount: data.length,
      totalDataSize: JSON.stringify(data).length,
      firstRecord: data[0] ? {
        id: data[0].id,
        source: data[0].source,
        base: data[0].base,
        quote: data[0].quote,
        sell: data[0].sell,
        buy: data[0].buy,
        updated_at: data[0].updated_at
      } : 'no records',
      allSources: [...new Set(data.map(r => r.source))],
      allBaseCurrencies: [...new Set(data.map(r => r.base))],
      allQuoteCurrencies: [...new Set(data.map(r => r.quote))]
    });

    console.log('🔄 [Supabase] Starting validation process...');
    const validated = data.map(validateRateRecord);
    const validRates = validated.filter(r => r.isValid);
    
    console.log('✅ [Supabase] Validation results:', {
      totalRecords: validated.length,
      validRecords: validRates.length,
      invalidRecords: validated.length - validRates.length,
      validSources: validRates.map(r => r.source),
      invalidRecords: validated.filter(r => !r.isValid).map(r => ({
        source: r.source,
        errors: r.validationErrors
      }))
    });

    const lastUpdated = new Date(
      validRates.length
        ? Math.max(...validRates.map(r => new Date(r.updated_at).getTime()))
        : new Date(data[0].updated_at ?? Date.now()).getTime()
    );

    console.log('✅ [Supabase] Successfully processed rates data');

    return {
      rates: validated,
      hasValidRates: validRates.length > 0,
      totalRates: validated.length,
      validRatesCount: validRates.length,
      invalidRatesCount: validated.length - validRates.length,
      lastUpdated,
      isFromDatabase: true,
    };
  } catch (e: any) {
    // Перехватываем все типы ошибок с детальным логированием
    console.error('❌ [Supabase] Exception caught:', {
      name: e?.name,
      message: e?.message,
      stack: e?.stack?.substring(0, 500) + '...', // Ограничиваем размер стека
      cause: e?.cause,
      code: e?.code,
      details: e?.details,
      hint: e?.hint,
      timestamp: new Date().toISOString()
    });
    
    const msg =
      e?.name === 'AbortError'
        ? 'Supabase request timeout (15 seconds exceeded)'
        : e?.name === 'TypeError' && e?.message?.includes('fetch')
        ? 'Network connection error to Supabase'
        : e?.message || 'Unknown Supabase error';

    console.error('❌ [Supabase] Final error message:', msg);

    return {
      rates: [],
      hasValidRates: false,
      totalRates: 0,
      validRatesCount: 0,
      invalidRatesCount: 0,
      lastUpdated: new Date(),
      isFromDatabase: false,
      error: msg,
    };
  }
}

export async function getKenigAndBestchangeUSDT() {
  if (!isServerSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const supabase: SupabaseClient = getServerSupabaseClient({ useServiceRole: false, timeoutMs: 15_000 });

  // Берём только нужные строки: источник ∈ {kenig, bestchange}, базовая USDT, котировка RUB
  const { data, error } = await supabase
    .from('kenig_rates')
    .select('source,sell,buy,updated_at')
    .in('source', ['kenig', 'bestchange'])
    .eq('base', 'USDT')
    .eq('quote', 'RUB')
    .order('updated_at', { ascending: false });

  if (error) throw error;

  // Берём самые свежие по каждому источнику
  const latest: Record<string, any> = {};
  for (const row of data ?? []) {
    if (!latest[row.source]) latest[row.source] = row;
  }

  const lastUpdated =
    data && data.length ? new Date(data[0].updated_at ?? Date.now()) : new Date();

  return {
    kenig: latest['kenig'] ?? null,
    bestchange: latest['bestchange'] ?? null,
    isFromDatabase: true,
    lastUpdated,
  };
}
