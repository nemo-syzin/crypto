// lib/supabase/client.ts
'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Берём значения только из NEXT_PUBLIC_*
 * Эти переменные должны быть заданы на этапе билда (Netlify → Environment variables).
 */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Мини‑валидация (без фанатизма) */
const hasUrl = typeof URL === 'string' && URL.startsWith('https://') && URL.includes('.supabase.co');
const hasKey = typeof KEY === 'string' && KEY.length > 20; // anon key — это JWT, обычно >100 символов

/** Если что-то не задано — сразу бросаем понятную ошибку (чтобы не было “тихих” поломок). */
if (!hasUrl || !hasKey) {
  // Делаем вывод максимально явным в консоли
  // (в проде тоже лучше увидеть понятную причину)
  // eslint-disable-next-line no-console
  console.error(
    '[supabase] Missing or invalid env vars.\n' +
    `  NEXT_PUBLIC_SUPABASE_URL: ${URL ?? '<undefined>'}\n` +
    `  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${KEY ? `set (len=${KEY.length})` : '<undefined>'}\n` +
    'Fix: set both variables in Netlify → Site → Settings → Build & deploy → Environment variables,\n' +
    'then run “Deploy project without cache”.'
  );
  throw new Error('[supabase] Env vars not configured: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/** Создаём одиночный клиент */
export const supabase: SupabaseClient = createClient(URL!, KEY!, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/** Удобные флаги/статус (если нужно где‑то показать в UI или залогировать) */
export const isSupabaseConfigured = true as const;
export const getSupabaseStatus = () => ({
  hasUrl,
  hasKey,
  url: URL!,
  keyLength: KEY!.length,
});

/** Диагностический лог — оставь временно, потом можно удалить */
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log(
    '[supabase] configured:',
    { url: URL, anonKeyLen: KEY!.length }
  );

  // Быстрый пробный пинг сессии (не влияет на работу)
  supabase.auth.getSession().then(({ data, error }) => {
    // eslint-disable-next-line no-console
    console.log('[supabase] getSession probe:', {
      hasSession: !!data?.session,
      error: error?.message ?? null,
    });
  });
}