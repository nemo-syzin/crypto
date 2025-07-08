import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const hasValidEnvVars = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseAnonKey !== 'your-anon-public-key-here' &&
  !supabaseUrl.includes('xyzcompany') // Exclude example URL
);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export const isSupabaseAvailable = () => hasValidEnvVars;

export const getSupabaseStatus = () => ({
  hasUrl: !!(supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co'),
  hasKey: !!(supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key-here'),
  isConfigured: hasValidEnvVars && !supabaseUrl?.includes('xyzcompany'),
  url: supabaseUrl,
});