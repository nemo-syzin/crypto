// lib/supabase/server.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Создаем admin клиент с service role ключом только если есть ключи
export const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE, {
      auth: { persistSession: false }
    })
  : null;

export function getServerSupabaseClient(options?: { useServiceRole?: boolean; timeoutMs?: number }): SupabaseClient {
  const { useServiceRole = false, timeoutMs = 15000 } = options ?? {};

  if (!SUPABASE_URL || !SUPABASE_ANON) {
    throw new Error('Missing Supabase configuration: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  // Обёртка fetch с таймаутом — работает и в Edge, и в Node
  const withTimeoutFetch = (ms: number) => {
    return async (input: RequestInfo | URL, init?: RequestInit) => {
      console.log(`🌐 [Supabase Fetch] Starting request to: ${typeof input === 'string' ? input.substring(0, 100) : 'URL object'}`);
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), ms);
      try {
        const startTime = Date.now();
        const response = await fetch(input, { ...init, signal: controller.signal });
        const duration = Date.now() - startTime;
        console.log(`✅ [Supabase Fetch] Request completed in ${duration}ms, status: ${response.status}`);
        return response;
      } finally {
        clearTimeout(id);
      }
    };
  };

  console.log(`🔧 [Supabase Client] Creating client with timeout: ${timeoutMs}ms, useServiceRole: ${useServiceRole}`);

  const key = useServiceRole && SUPABASE_SERVICE ? SUPABASE_SERVICE : SUPABASE_ANON;

  return createClient(
    SUPABASE_URL,
    key,
    {
      global: { fetch: withTimeoutFetch(timeoutMs) },
      auth: { persistSession: false },
    }
  );
}

export function isServerSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON && SUPABASE_URL.startsWith('https://'));
}

export function getServerSupabaseStatus() {
  return {
    hasUrl: Boolean(SUPABASE_URL && SUPABASE_URL.startsWith('https://')),
    hasAnon: Boolean(SUPABASE_ANON),
    hasService: Boolean(SUPABASE_SERVICE),
    url: SUPABASE_URL,
  };
}