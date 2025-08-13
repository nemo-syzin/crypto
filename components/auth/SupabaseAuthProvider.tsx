"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

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
    // Получаем текущую сессию при загрузке
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Ошибка получения сессии:', error);
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

    // Подписываемся на изменения состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Обновляем статус оператора при входе/выходе
        if (session?.user) {
          // Проверяем, является ли пользователь оператором
          const { data: operatorData } = await supabase
            .from('chat_operators')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (operatorData) {
            // Устанавливаем статус "онлайн" для оператора
            await supabase
              .from('chat_operators')
              .update({ is_online: true, updated_at: new Date().toISOString() })
              .eq('user_id', session.user.id);
          }
        } else {
          // При выходе устанавливаем статус "оффлайн" для всех операторов этого пользователя
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          if (currentUser) {
            await supabase
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
      // Устанавливаем статус "оффлайн" перед выходом
      if (user) {
        await supabase
          .from('chat_operators')
          .update({ is_online: false })
          .eq('user_id', user.id);
      }

      const { error } = await supabase.auth.signOut();
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
      const { data: { session }, error } = await supabase.auth.refreshSession();
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