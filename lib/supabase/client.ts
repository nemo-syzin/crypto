import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Добавляем логи для отладки
console.log('Supabase Client Init: NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'configured' : 'NOT CONFIGURED');
console.log('Supabase Client Init: NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'configured' : 'NOT CONFIGURED');

const hasValidEnvVars = !!(supabaseUrl && supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-public-key-here');

console.log('Supabase Client Init: hasValidEnvVars:', hasValidEnvVars);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export const isSupabaseAvailable = () => hasValidEnvVars;
