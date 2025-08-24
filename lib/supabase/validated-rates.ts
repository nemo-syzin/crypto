import type { SupabaseClient } from '@supabase/supabase-js';
import { getServerSupabaseClient, isServerSupabaseConfigured, getServerSupabaseStatus } from './server';

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
 * Читает последние записи из таблицы `kenig_rates`, валидирует и возвращает агрегат.
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
    // Выполняем запрос к таблице kenig_rates
    console.log('🔄 [Supabase] Querying kenig_rates table...');
    console.log('🔍 [Supabase] Query details: SELECT * FROM kenig_rates ORDER BY updated_at DESC LIMIT 50');
    
    const queryStartTime = Date.now();
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(50);

    const queryDuration = Date.now() - queryStartTime;
    console.log(`⏱️ [Supabase] Query completed in ${queryDuration}ms`);
    if (error) {
      console.error('❌ [Supabase] Query error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        queryDuration: queryDuration
      });
      throw new Error(`Supabase error: ${error.message} (Code: ${error.code || ''})`);
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ [Supabase] No data found in kenig_rates table');
      console.log('🔍 [Supabase] Table might be empty or query filters too restrictive');
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