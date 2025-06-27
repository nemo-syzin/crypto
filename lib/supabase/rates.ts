import { supabase, isSupabaseAvailable, getSupabaseStatus } from './client';

interface KenigRate {
  id: number;
  usdt_sell_rate: number;
  usdt_buy_rate: number;
  updated_at: string;
  source: string;
}

interface AllRates {
  kenig: { sell: number | null; buy: number | null; updated_at?: string };
  bestchange: { sell: number | null; buy: number | null; updated_at?: string };
  energo: { sell: number | null; buy: number | null; updated_at?: string };
  timestamp: string;
  isFromDatabase: boolean;
  error?: string;
}

// Helper function to safely convert to number
const safeToNumber = (value: any): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? null : num;
};

// Get all rates from kenig_rates table
export async function getAllRates(): Promise<AllRates> {
  const status = getSupabaseStatus();
  
  if (!isSupabaseAvailable()) {
    const errorMessage = !status.hasUrl 
      ? 'Supabase URL not configured. Please set NEXT_PUBLIC_SUPABASE_URL in your .env.local file.'
      : !status.hasKey 
      ? 'Supabase API key not configured. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
      : 'Supabase not properly configured. Please check your environment variables.';
    
    console.error('❌ Supabase configuration error:', errorMessage);
    throw new Error(errorMessage);
  }

  try {
    console.log('🔄 Fetching all rates from kenig_rates table...');
    
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('*')
      .order('id');

    if (error) {
      console.error('❌ Supabase rates fetch error:', error);
      
      // Provide specific error messages
      if (error.message.includes('Invalid API key')) {
        throw new Error('Invalid Supabase API key. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local file. Get the correct key from your Supabase dashboard.');
      }
      
      if (error.message.includes('relation "kenig_rates" does not exist') || error.code === '42P01') {
        throw new Error('Database table "kenig_rates" not found. Please run the Supabase migration to create the table.');
      }
      
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No data found in kenig_rates table');
      throw new Error('No exchange rate data found in database. Please ensure the table has been populated with initial data.');
    }

    // Initialize result with null values
    const result: AllRates = {
      kenig: { sell: null, buy: null },
      bestchange: { sell: null, buy: null },
      energo: { sell: null, buy: null },
      timestamp: new Date().toISOString(),
      isFromDatabase: true
    };

    // Map data by source with safe number conversion
    data.forEach(row => {
      const rateData = {
        sell: safeToNumber(row.usdt_sell_rate),
        buy: safeToNumber(row.usdt_buy_rate),
        updated_at: row.updated_at
      };

      if (row.source === 'kenig') {
        result.kenig = rateData;
      } else if (row.source === 'bestchange') {
        result.bestchange = rateData;
      } else if (row.source === 'energo') {
        result.energo = rateData;
      }
    });

    // Use the most recent timestamp
    const timestamps = data.map(row => row.updated_at).filter(Boolean);
    if (timestamps.length > 0) {
      result.timestamp = timestamps.sort().reverse()[0];
    }

    console.log('✅ All rates loaded from kenig_rates table successfully');
    return result;

  } catch (error) {
    console.error('❌ Supabase rates service error:', error);
    throw error;
  }
}

// Get KenigSwap rates specifically
export async function getKenig(): Promise<KenigRate | null> {
  const status = getSupabaseStatus();
  
  if (!isSupabaseAvailable()) {
    const errorMessage = !status.hasUrl 
      ? 'Supabase URL not configured. Please set NEXT_PUBLIC_SUPABASE_URL in your .env.local file.'
      : !status.hasKey 
      ? 'Supabase API key not configured. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
      : 'Supabase not properly configured. Please check your environment variables.';
    
    console.error('❌ Supabase configuration error:', errorMessage);
    throw new Error(errorMessage);
  }

  try {
    console.log('🔄 Fetching KenigSwap rates from kenig_rates table...');
    
    const { data, error } = await supabase
      .from('kenig_rates')
      .select('*')
      .eq('source', 'kenig')
      .single();

    if (error) {
      console.error('❌ Failed to fetch KenigSwap rates:', error);
      
      // Provide specific error messages
      if (error.message.includes('Invalid API key')) {
        throw new Error('Invalid Supabase API key. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local file.');
      }
      
      if (error.code === 'PGRST116') {
        throw new Error('No KenigSwap rates found in database. Please ensure the data has been populated.');
      }
      
      if (error.message.includes('relation "kenig_rates" does not exist') || error.code === '42P01') {
        throw new Error('Database table "kenig_rates" not found. Please run the Supabase migration to create the table.');
      }
      
      throw new Error(`Database error: ${error.message}`);
    }

    // Convert rates to numbers safely
    const normalizedData = {
      ...data,
      usdt_sell_rate: safeToNumber(data.usdt_sell_rate) || 0,
      usdt_buy_rate: safeToNumber(data.usdt_buy_rate) || 0
    };

    console.log('✅ KenigSwap rates loaded successfully');
    return normalizedData;
  } catch (error) {
    console.error('❌ KenigSwap rates error:', error);
    throw error;
  }
}

// Update KenigSwap rates
export async function updateKenigRates(sellRate: number, buyRate: number): Promise<boolean> {
  if (!isSupabaseAvailable()) {
    throw new Error('Supabase not configured. Please set environment variables.');
  }

  try {
    console.log('🔄 Updating KenigSwap rates in kenig_rates table...');
    
    const { error } = await supabase
      .from('kenig_rates')
      .update({ 
        usdt_sell_rate: sellRate, 
        usdt_buy_rate: buyRate,
        updated_at: new Date().toISOString()
      })
      .eq('source', 'kenig');

    if (error) {
      console.error('❌ Failed to update rates:', error);
      throw error;
    }

    console.log('✅ KenigSwap rates updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating rates:', error);
    throw error;
  }
}