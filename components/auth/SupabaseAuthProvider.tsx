"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
  isConfigured: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within SupabaseAuthProvider');
  }
  return context;
};

interface SupabaseAuthProviderProps {
  children: React.ReactNode;
}

export function SupabaseAuthProvider({ children }: SupabaseAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    const configured = isSupabaseAvailable();
    setIsConfigured(configured);

    if (!configured) {
      console.warn('[SupabaseAuthProvider] Supabase не настроен, аутентификация недоступна');
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[SupabaseAuthProvider] Ошибка получения сессии:', error);
          // Don't throw, just log and continue
        } else if (session) {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        console.error('[SupabaseAuthProvider] Исключение при получении сессии:', error);
        // Silently fail - auth is not available
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[SupabaseAuthProvider] Auth state changed:', event);

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Update operator status on login/logout (only if session exists)
        if (session?.user) {
          try {
            const { data: operatorData } = await supabase
              .from('chat_operators')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();

            if (operatorData) {
              await supabase
                .from('chat_operators')
                .update({ is_online: true, updated_at: new Date().toISOString() })
                .eq('user_id', session.user.id);
            }
          } catch (error) {
            console.error('[SupabaseAuthProvider] Ошибка обновления статуса оператора:', error);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    if (!isConfigured) {
      console.warn('[SupabaseAuthProvider] Cannot sign out - Supabase not configured');
      return;
    }

    try {
      // Set operator offline before logout
      if (user) {
        await supabase
          .from('chat_operators')
          .update({ is_online: false })
          .eq('user_id', user.id)
          .catch(err => console.error('Error updating operator status:', err));
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[SupabaseAuthProvider] Ошибка выхода:', error);
        throw error;
      }
    } catch (error) {
      console.error('[SupabaseAuthProvider] Исключение при выходе:', error);
      throw error;
    }
  };

  const refreshSession = async () => {
    if (!isConfigured) {
      console.warn('[SupabaseAuthProvider] Cannot refresh session - Supabase not configured');
      return;
    }

    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('[SupabaseAuthProvider] Ошибка обновления сессии:', error);
      } else if (session) {
        setSession(session);
        setUser(session.user);
      }
    } catch (error) {
      console.error('[SupabaseAuthProvider] Исключение при обновлении сессии:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
    isConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
