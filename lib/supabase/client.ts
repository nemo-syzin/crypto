import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
const hasValidEnvVars = !!(supabaseUrl && supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-public-key-here' &&
  supabaseUrl.length > 10 &&
  supabaseAnonKey.length > 10);

// Only log configuration status in development
if (process.env.NODE_ENV === 'development') {
  if (!hasValidEnvVars) {
    console.warn('⚠️ Supabase configuration not properly set. Please check your .env.local file.');
  } else {
    console.log('✅ Supabase configuration valid');
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export const isSupabaseAvailable = () => hasValidEnvVars;

export const getSupabaseStatus = () => ({
  hasUrl: !!(supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co'),
  hasKey: !!(supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key-here'),
  isConfigured: hasValidEnvVars,
  url: supabaseUrl
});