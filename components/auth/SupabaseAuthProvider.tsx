'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within SupabaseAuthProvider');
  return ctx;
};

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Инициализация: восстановить сессию
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        console.log('[auth] getSession…');
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error('[auth] getSession error:', error);
        if (!mounted) return;
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      } catch (e) {
        console.error('[auth] getSession exception:', e);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('[auth] loading=false (initial)');
        }
      }
    })();

    // Подписка на изменения auth
    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('[auth] onAuthStateChange:', event, newSession?.user?.id);
      setSession(newSession ?? null);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Побочные эффекты для операторов — отдельно, чтобы не блокировать auth
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!user) return;

        const { data: operatorRow, error: opCheckErr } = await supabase
          .from('chat_operators')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (opCheckErr) {
          console.warn('[auth] chat_operators check error:', opCheckErr.message);
          return;
        }
        if (!operatorRow || cancelled) return;

        await supabase
          .from('chat_operators')
          .update({ is_online: true, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);
      } catch (e) {
        console.warn('[auth] operator side-effect error:', e);
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  const signOut = async () => {
    try {
      // best-effort: не блокируем выход
      if (user) {
        supabase.from('chat_operators')
          .update({ is_online: false })
          .eq('user_id', user.id)
          .then(() => {}, () => {});
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      console.error('[auth] signOut error:', e);
      throw e;
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
    } catch (e) {
      console.error('[auth] refreshSession error:', e);
    }
  };

  const value = useMemo<AuthContextType>(() => ({
    user, session, loading, signOut, refreshSession,
  }), [user, session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}