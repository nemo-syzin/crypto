import { createClient } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string;
          avatar_url: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name?: string;
          avatar_url?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          amount_usdt: number;
          amount_rub: number;
          rate: number;
          status: 'pending' | 'completed' | 'failed';
          transaction_type: 'buy' | 'sell';
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          amount_usdt: number;
          amount_rub: number;
          rate: number;
          status: 'pending' | 'completed' | 'failed';
          transaction_type: 'buy' | 'sell';
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          amount_usdt?: number;
          amount_rub?: number;
          rate?: number;
          status?: 'pending' | 'completed' | 'failed';
          transaction_type?: 'buy' | 'sell';
        };
      };
      reviews: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          rating: number;
          comment: string;
          is_displayed: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          rating: number;
          comment: string;
          is_displayed?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          rating?: number;
          comment?: string;
          is_displayed?: boolean;
        };
      };
      exchange_rates: {
        Row: {
          id: number;
          usdt_sell_rate: number;
          usdt_buy_rate: number;
          updated_at: string;
        };
        Insert: {
          id?: number;
          usdt_sell_rate: number;
          usdt_buy_rate: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          usdt_sell_rate?: number;
          usdt_buy_rate?: number;
          updated_at?: string;
        };
      };
    };
  };
};

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are set
const hasValidEnvVars = !!(supabaseUrl && supabaseAnonKey);

if (!hasValidEnvVars) {
  console.warn('⚠️ Supabase environment variables not configured. Using fallback mode.');
  console.log('To enable Supabase:');
  console.log('1. Create a .env.local file in your project root');
  console.log('2. Add: NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('3. Add: NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  console.log('4. Restart your development server');
}

// Create Supabase client with fallback values to prevent errors
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk3NzEyMDAuImV4cCI6MTk2NTM0NzIwMH0.placeholder'
);

// Helper function to check if Supabase is properly configured
export const checkSupabaseConnection = async () => {
  try {
    // Check if environment variables are set
    if (!hasValidEnvVars) {
      console.warn('⚠️ Supabase environment variables not set');
      return false;
    }

    // Try to query the exchange_rates table
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('count')
      .limit(1);
    
    if (error) {
      console.warn('⚠️ Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.warn('❌ Supabase connection error:', error);
    return false;
  }
};

// Helper function to get environment status
export const getSupabaseEnvStatus = () => {
  return {
    url: {
      value: supabaseUrl,
      isSet: !!supabaseUrl,
      isValid: !!(supabaseUrl && supabaseUrl.includes('supabase.co'))
    },
    anonKey: {
      value: supabaseAnonKey,
      isSet: !!supabaseAnonKey,
      isValid: !!(supabaseAnonKey && supabaseAnonKey.length > 20)
    },
    hasValidEnvVars
  };
};

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => hasValidEnvVars;