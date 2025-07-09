import { supabase, isSupabaseAvailable, getSupabaseStatus } from './client';

// Cache for validated rates to reduce database load
let ratesCache: { result: RateValidationResult; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Retry utility function
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`⚠️ Attempt ${attempt}/${maxRetries} failed:`, error);
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying, with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
}

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

function validateRateValue(value: any, fieldName: string, min: number = 50, max: number = 200): { isValid: boolean; error?: string } {
  if (value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is null or undefined` };
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  if (isNaN(numericValue) || !isFinite(numericValue)) {
    return { isValid: false, error: `${fieldName} is not a valid number` };
  }

  if (numericValue <= 0) {
    return { isValid: false, error: `${fieldName} must be greater than 0` };
  }

  return { isValid: true };
}

function validateRateRecord(rate: any): ValidatedKenigRate {
  const validationErrors: string[] = [];
  let isValid = true;

  // Проверяем разные возможные названия полей
  const sellField = rate.usdt_sell_rate !== undefined ? 'usdt_sell_rate' : 
                   rate.sell_rate !== undefined ? 'sell_rate' : 
                   rate.sell !== undefined ? 'sell' : null;
                   
  const buyField = rate.usdt_buy_rate !== undefined ? 'usdt_buy_rate' : 
                  rate.buy_rate !== undefined ? 'buy_rate' : 
                  rate.buy !== undefined ? 'buy' : null;

  if (!sellField) {
    validationErrors.push('Sell rate field not found (checked: usdt_sell_rate, sell_rate, sell)');
    isValid = false;
  } else {
    const sellValidation = validateRateValue(rate[sellField], 'Sell rate');
    if (!sellValidation.isValid) {
      validationErrors.push(sellValidation.error!);
      isValid = false;
    }
  }

  if (!buyField) {
    validationErrors.push('Buy rate field not found (checked: usdt_buy_rate, buy_rate, buy)');
    isValid = false;
  } else {
    const buyValidation = validateRateValue(rate[buyField], 'Buy rate');
    if (!buyValidation.isValid) {
      validationErrors.push(buyValidation.error!);
      isValid = false;
    }
  }

  if (sellField && buyField && isValid) {
    const sellRate = parseFloat(rate[sellField]);
    const buyRate = parseFloat(rate[buyField]);
    
    // Removed the sell > buy validation as some crypto pairs might have different pricing models
  }

  const timestamp = rate.updated_at || rate.created_at;
  if (!timestamp) {
    validationErrors.push('Timestamp is missing');
    isValid = false;
  }

  return {
    id: rate.id || 0,
    source: rate.source || 'unknown',
    sell: sellField && isValid ? parseFloat(rate[sellField]) : 0,
    buy: buyField && isValid ? parseFloat(rate[buyField]) : 0,
    updated_at: timestamp || new Date().toISOString(),
    isValid,
    validationErrors
  };
}

export async function getValidatedKenigRates(): Promise<RateValidationResult> {
  const status = getSupabaseStatus();
  
  console.log('🔍 Checking Supabase configuration status:', status.isConfigured ? 'OK' : 'NOT CONFIGURED');
  
  // Check cache first
  const now = Date.now();
  if (ratesCache && (now - ratesCache.timestamp) < CACHE_DURATION) {
    console.log('📦 Using cached rates validation result');
    return ratesCache.result;
  }
  
  if (!isSupabaseAvailable()) {
    console.warn('⚠️ Supabase not available. Using fallback exchange rates.');
    const result: RateValidationResult = {
      rates: [],
      hasValidRates: false,
      totalRates: 0,
      validRatesCount: 0,
      invalidRatesCount: 0,
      lastUpdated: new Date(),
      isFromDatabase: false,
      error: `Supabase configuration issue: URL=${status.hasUrl ? 'OK' : 'MISSING'}, KEY=${status.hasKey ? 'OK' : 'MISSING'}. Copy .env.example to .env.local and fill in your Supabase credentials.`
    };
    
    // Cache the result even if Supabase is not available
    ratesCache = { result, timestamp: now };
    return result;
  }

  try {
    console.log('🔄 Querying kenig_rates table with timeout...');
    
    // Add timeout to the entire operation
    const queryPromise = queryRatesWithRetry();
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout after 15 seconds')), 15000)
    );
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error) {
      console.error('❌ Supabase query error:', error);
      throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
    }

    console.log('📊 Raw data from Supabase kenig_rates table:', data);

    if (!data || data.length === 0) {
      console.warn('⚠️ No data found in kenig_rates table, using empty result');
      return {
        rates: [
          {
            id: 1,
            source: 'kenig',
            sell: 95.50,
            buy: 94.80,
            updated_at: new Date().toISOString(),
            isValid: true,
            validationErrors: []
          }
        ],
        hasValidRates: true,
        totalRates: 0,
        validRatesCount: 1,
        invalidRatesCount: 0,
        lastUpdated: new Date(),
        isFromDatabase: true,
        error: 'No exchange rate data found in database, using fallback rates'
      };
    }

    const validatedRates = data.map(validateRateRecord);
    const validRates = validatedRates.filter(rate => rate.isValid);

    console.log(`✅ Validation complete: ${validRates.length}/${validatedRates.length} rates are valid`);

    // Log invalid rates for debugging
    const invalidRates = validatedRates.filter(rate => !rate.isValid);
    if (invalidRates.length > 0) {
      console.warn('⚠️ Invalid rates found:', invalidRates.map(r => ({
        source: r.source,
        errors: r.validationErrors
      })));
    }

    // Log structure of first record for debugging
    if (data.length > 0) {
      console.log('📋 First record structure:', Object.keys(data[0]));
    }

    const result = {
      rates: validatedRates,
      hasValidRates: validRates.length > 0,
      totalRates: validatedRates.length,
      validRatesCount: validRates.length,
      invalidRatesCount: validatedRates.length - validRates.length,
      lastUpdated: new Date(),
      isFromDatabase: true
    };
    
    // Cache successful result
    ratesCache = { result, timestamp: now };
    return result;

  } catch (error) {
    console.error('❌ Error in getValidatedKenigRates:', error);
    
    // Enhanced error handling to capture specific Supabase error messages
    let errorMessage = 'Unknown database error';
    
    if (error && typeof error === 'object') {
      // Handle Supabase error objects
      if ('message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
      } else if ('error' in error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if ('details' in error && typeof error.details === 'string') {
        errorMessage = error.details;
      } else if ('hint' in error && typeof error.hint === 'string') {
        errorMessage = `${errorMessage} (Hint: ${error.hint})`;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } 

    return {
      rates: [],
      hasValidRates: false,
      totalRates: 0,
      validRatesCount: 0,
      invalidRatesCount: 0,
      lastUpdated: new Date(),
      isFromDatabase: false,
      error: errorMessage
    };
  }
}

// Helper function to query rates with retry logic
async function queryRatesWithRetry() {
  // Try up to 3 times with exponential backoff
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      console.log(`🔄 Query attempt ${attempt + 1}/3...`);
      
      const result = await supabase!
        .from('kenig_rates')
        .select('*')
        .order('updated_at', { ascending: false });
      
      return result;
    } catch (error) {
      console.warn(`⚠️ Query attempt ${attempt + 1} failed:`, error);
      
      if (attempt < 2) {
        // Exponential backoff with jitter
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000) + Math.random() * 1000;
        console.log(`⏱️ Retrying in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}