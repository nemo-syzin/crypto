"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseBrowser } from '@/lib/supabase/browser';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
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

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabaseBrowser.auth.getSession();

        if (error) {
          console.error('SupabaseAuthProvider: Ошибка получения сессии:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Ошибка при получении начальной сессии:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(
      async (event, session) => {
        console.log('SupabaseAuthProvider: Auth state changed:', event, 'User:', session?.user?.email, 'Session:', session);

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          const { data: operatorData } = await supabaseBrowser
            .from('chat_operators')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (operatorData) {
            await supabaseBrowser
              .from('chat_operators')
              .update({ is_online: true, updated_at: new Date().toISOString() })
              .eq('user_id', session.user.id);
          }
        } else {
          const { data: { user: currentUser } } = await supabaseBrowser.auth.getUser();
          if (currentUser) {
            await supabaseBrowser
              .from('chat_operators')
              .update({ is_online: false })
              .eq('user_id', currentUser.id);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      if (user) {
        await supabaseBrowser
          .from('chat_operators')
          .update({ is_online: false })
          .eq('user_id', user.id);
      }

      const { error } = await supabaseBrowser.auth.signOut();
      if (error) {
        console.error('Ошибка выхода:', error);
        throw error;
      }
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabaseBrowser.auth.refreshSession();
      if (error) {
        console.error('Ошибка обновления сессии:', error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
    } catch (error) {
      console.error('Ошибка при обновлении сессии:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}