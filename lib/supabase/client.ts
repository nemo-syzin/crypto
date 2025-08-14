import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Добавляем подробные логи для отладки
console.log('Supabase Client Init: Environment check');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT CONFIGURED');
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'NOT CONFIGURED');

const hasValidEnvVars = !!(supabaseUrl && supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-public-key-here');

console.log('- hasValidEnvVars:', hasValidEnvVars);

if (!hasValidEnvVars) {
  console.error('❌ Supabase configuration invalid!');
  console.error('- URL valid:', !!(supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co'));
  console.error('- Key valid:', !!(supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key-here'));
} else {
  console.log('✅ Supabase configuration valid');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export const isSupabaseAvailable = () => hasValidEnvVars;
