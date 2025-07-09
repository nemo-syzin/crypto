import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasValidEnvVars = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseAnonKey !== 'your-anon-public-key-here');

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: false
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });
      },
    },
  }
);

export const isSupabaseAvailable = () => hasValidEnvVars;

export const getSupabaseStatus = () => ({
  hasUrl: !!(supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co'),
  hasKey: !!(supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key-here'),
  isConfigured: hasValidEnvVars,
  url: supabaseUrl,
});