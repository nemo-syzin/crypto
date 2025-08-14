```typescript
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
        console.log('SupabaseAuthProvider: useEffect started');
        // Получаем текущую сессию при загрузке
        const getInitialSession = async () => {
          console.log('SupabaseAuthProvider: Attempting to get initial session...');
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
              console.error('SupabaseAuthProvider: Error getting initial session:', error);
            } else {
              console.log('SupabaseAuthProvider: Initial session data:', session);
              setSession(session);
              setUser(session?.user ?? null);
            }
          } catch (error) {
            console.error('SupabaseAuthProvider: Error fetching initial session:', error);
          } finally {
            setLoading(false);
            console.log('SupabaseAuthProvider: Initial session check finished, loading set to false.');
          }
        };

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
                console.log('SupabaseAuthProvider: Operator status set to online.');
              }
            } else {
              // При выходе устанавливаем статус "оффлайн" для всех операторов этого пользователя
              const { data: { user: currentUser } } = await supabase.auth.getUser();
              if (currentUser) {
                await supabase
                  .from('chat_operators')
                  .update({ is_online: false })
                  .eq('user_id', currentUser.id);
                console.log('SupabaseAuthProvider: Operator status set to offline on logout.');
              }
            }
          }
        );

        return () => {
          console.log('SupabaseAuthProvider: useEffect cleanup.');
          subscription.unsubscribe();
        };
      }, []);

      const signOut = async () => {
        console.log('SupabaseAuthProvider: Signing out...');
        try {
          // Устанавливаем статус "оффлайн" перед выходом
          if (user) {
            await supabase
              .from('chat_operators')
              .update({ is_online: false })
              .eq('user_id', user.id);
            console.log('SupabaseAuthProvider: Operator status set to offline before sign out.');
          }

          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('SupabaseAuthProvider: Sign out error:', error);
            throw error;
          }
          console.log('SupabaseAuthProvider: Sign out successful.');
        } catch (error) {
          console.error('SupabaseAuthProvider: Error during sign out:', error);
          throw error;
        }
      };

      const refreshSession = async () => {
        console.log('SupabaseAuthProvider: Refreshing session...');
        try {
          const { data: { session }, error } = await supabase.auth.refreshSession();
          if (error) {
            console.error('SupabaseAuthProvider: Error refreshing session:', error);
          } else {
            console.log('SupabaseAuthProvider: Session refreshed:', session);
            setSession(session);
            setUser(session?.user ?? null);
          }
        } catch (error) {
          console.error('SupabaseAuthProvider: Error during session refresh:', error);
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
    ```