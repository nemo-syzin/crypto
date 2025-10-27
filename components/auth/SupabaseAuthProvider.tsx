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
    // Получаем текущую сессию при загрузке с timeout для быстрой загрузки страницы
    const getInitialSession = async () => {
      try {
        // Создаем promise с timeout 2 секунды
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<{ data: { session: null }, error: Error }>((_, reject) =>
          setTimeout(() => reject(new Error('Session fetch timeout')), 2000)
        );

        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);

        if (error) {
          console.warn('SupabaseAuthProvider: Ошибка получения сессии (не критично):', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.warn('SupabaseAuthProvider: Timeout получения сессии (не критично), продолжаем без авторизации:', error);
        // Не блокируем загрузку страницы - продолжаем без сессии
      } finally {
        // КРИТИЧНО: всегда устанавливаем loading=false даже при ошибке
        setLoading(false);
      }
    };

    // Немедленно устанавливаем loading=false для быстрого рендеринга
    setLoading(false);

    // Загружаем сессию асинхронно в фоне
    getInitialSession();

    // Подписываемся на изменения состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('SupabaseAuthProvider: Auth state changed:', event, 'User:', session?.user?.email, 'Session:', session);
        
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