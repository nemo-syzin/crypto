"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/SupabaseAuthProvider';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  LogOut, 
  Shield, 
  Activity,
  CreditCard,
  Bell,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  created_at: string;
  updated_at: string;
}

export function DashboardClient() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadUserProfile();
      }
    }
  }, [user, authLoading, router]);

  const loadUserProfile = async () => {
    try {
      setProfileLoading(true);
      
      // Загружаем профиль пользователя
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.warn('Profile not found, creating default profile');
        // Если профиль не найден, создаем базовый
        setProfile({
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: null,
          phone: null,
          notification_preferences: {
            email: true,
            sms: false,
            push: true
          },
          created_at: user.created_at,
          updated_at: user.created_at
        });
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const maskEmail = (email: string) => {
    if (showEmail) return email;
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#001D8D]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg font-medium">Загрузка личного кабинета...</span>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Заголовок */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4">
              Личный кабинет
            </h1>
            <p className="text-lg text-[#001D8D]/70 leading-relaxed">
              Добро пожаловать, {profile.full_name || 'Пользователь'}!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Левая колонка - Профиль */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Карточка профиля */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#001D8D] to-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-[#001D8D]">
                    {profile.full_name || 'Пользователь'}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Верифицирован
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Email */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-[#001D8D]/60" />
                      <span className="text-sm text-[#001D8D]/70">
                        {maskEmail(user.email || '')}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowEmail(!showEmail)}
                      className="text-[#001D8D]/60 hover:text-[#001D8D]"
                    >
                      {showEmail ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Дата регистрации */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-[#001D8D]/60" />
                    <div>
                      <div className="text-xs text-[#001D8D]/60">Дата регистрации</div>
                      <div className="text-sm text-[#001D8D]/70">
                        {formatDate(profile.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="space-y-3 pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full text-[#001D8D] border-[#001D8D]/20 hover:bg-[#001D8D]/5"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Настройки профиля
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={async () => {
                        try {
                          await signOut();
                          toast({
                            title: "Выход выполнен",
                            description: "Вы успешно вышли из аккаунта.",
                          });
                          router.push('/');
                        } catch (error) {
                          console.error('Logout error:', error);
                          toast({
                            title: "Ошибка",
                            description: "Не удалось выйти из аккаунта.",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Выйти из аккаунта
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Уведомления */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-[#001D8D] flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Уведомления
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#001D8D]/70">Email уведомления</span>
                      <Badge className={profile.notification_preferences.email ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                        {profile.notification_preferences.email ? 'Включены' : 'Отключены'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#001D8D]/70">Push уведомления</span>
                      <Badge className={profile.notification_preferences.push ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                        {profile.notification_preferences.push ? 'Включены' : 'Отключены'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Правая колонка - Основной контент */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Быстрые действия */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#001D8D]">
                    Быстрые действия
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white hover:opacity-90 h-16"
                      onClick={() => router.push('/exchange')}
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Обменять криптовалюту
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="text-[#001D8D] border-[#001D8D]/20 hover:bg-[#001D8D]/5 h-16"
                      onClick={() => router.push('/rates')}
                    >
                      <Activity className="h-5 w-5 mr-2" />
                      Посмотреть курсы
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* История операций */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#001D8D]">
                    История операций
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-[#001D8D]/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#001D8D] mb-2">
                      Операций пока нет
                    </h3>
                    <p className="text-[#001D8D]/70 mb-6">
                      Здесь будет отображаться история ваших обменов криптовалют
                    </p>
                    <Button 
                      onClick={() => router.push('/exchange')}
                      className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white hover:opacity-90"
                    >
                      Совершить первый обмен
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Статистика аккаунта */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#001D8D]">
                    Статистика аккаунта
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-[#001D8D] mb-1">0</div>
                      <div className="text-sm text-[#001D8D]/70">Всего операций</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-[#001D8D] mb-1">₽0</div>
                      <div className="text-sm text-[#001D8D]/70">Общий объем</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-[#001D8D] mb-1">
                        {Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-sm text-[#001D8D]/70">Дней с нами</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}