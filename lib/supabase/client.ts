import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasValidEnvVars = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseAnonKey !== 'your-anon-public-key-here');

export const supabase = hasValidEnvVars ? createClient(
  supabaseUrl!,
  supabaseAnonKey!,
  {
    auth: {
      persistSession: false
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
      }
    }
  }
) : null;

export const isSupabaseAvailable = () => hasValidEnvVars;

export const testSupabaseConnection = async (): Promise<{ success: boolean; error?: string }> => {
  if (!hasValidEnvVars || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Simple connection test
    const { error } = await supabase.from('kenig_rates').select('count').limit(1);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Connection test failed' 
    };
  }
};
export const getSupabaseStatus = () => ({
  hasUrl: !!(supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co'),
  hasKey: !!(supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key-here'),
  isConfigured: hasValidEnvVars,
  url: supabaseUrl,
});