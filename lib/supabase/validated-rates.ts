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

  if (!isServerSupabaseConfigured()) {
    return {
      rates: [],
      hasValidRates: false,
      totalRates: 0,
      validRatesCount: 0,
      invalidRatesCount: 0,
      lastUpdated: new Date(),
      isFromDatabase: false,
      error: `Supabase configuration issue: URL=${status.hasUrl ? 'OK' : 'MISSING'}, ANON=${status.hasAnon ? 'OK' : 'MISSING'}`,
    };
  }

  // создаём КЛИЕНТ ЗДЕСЬ
  const supabase: SupabaseClient = getServerSupabaseClient({ useServiceRole: false, timeoutMs: 8000 });

  try {
    // подстрой под свою схему (колонки и сортировку)
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`Supabase error: ${error.message} (Code: ${error.code || ''})`);
    }

    if (!data || data.length === 0) {
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

    const validated = data.map(validateRateRecord);
    const validRates = validated.filter(r => r.isValid);

    const lastUpdated = new Date(
      validRates.length
        ? Math.max(...validRates.map(r => new Date(r.updated_at).getTime()))
        : new Date(data[0].updated_at ?? Date.now()).getTime()
    );

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
    // перехватываем сетевые сбои / аборты / таймауты
    const msg =
      e?.name === 'AbortError'
        ? 'Supabase request timeout'
        : e?.message || 'Unknown Supabase error';

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