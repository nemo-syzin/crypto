"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Loader as Loader2, Shield, ArrowLeft } from 'lucide-react';

interface PasswordData {
  password: string;
  confirmPassword: string;
}

export function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);
  
  const [formData, setFormData] = useState<PasswordData>({
    password: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState<Partial<PasswordData>>({});

  // Проверяем сессию при загрузке страницы
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabaseBrowser.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          setError('Ошибка проверки сессии. Попробуйте запросить сброс пароля заново.');
          setSessionChecked(true);
          return;
        }

        if (session) {
          setHasValidSession(true);
        } else {
          // Проверяем URL параметры для токена сброса пароля
          const accessToken = searchParams.get('access_token');
          const refreshToken = searchParams.get('refresh_token');
          const type = searchParams.get('type');

          if (type === 'recovery' && accessToken && refreshToken) {
            // Устанавливаем сессию из URL параметров
            const { error: sessionError } = await supabaseBrowser.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              console.error('Session setup error:', sessionError);
              setError('Недействительная или истекшая ссылка для сброса пароля. Запросите новую ссылку.');
            } else {
              setHasValidSession(true);
            }
          } else {
            setError('Недействительная ссылка для сброса пароля. Убедитесь, что вы перешли по ссылке из письма.');
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
        setError('Произошла ошибка при проверке сессии.');
      } finally {
        setSessionChecked(true);
      }
    };

    checkSession();
  }, [searchParams]);

  // Валидация формы
  const validateForm = (): boolean => {
    const errors: Partial<PasswordData> = {};

    // Проверка пароля
    if (!formData.password) {
      errors.password = 'Введите новый пароль';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }

    // Проверка подтверждения пароля
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Подтвердите новый пароль';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof PasswordData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку для этого поля при изменении
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Очищаем общую ошибку
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabaseBrowser.auth.updateUser({
        password: formData.password
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      toast({
        title: "Пароль обновлен!",
        description: "Ваш пароль был успешно изменен. Теперь вы можете войти с новым паролем.",
      });

      // Перенаправляем на страницу входа через 3 секунды
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Password update error:', err);
      
      // Обработка различных типов ошибок
      let errorMessage = 'Произошла ошибка при обновлении пароля';
      
      if (err.message?.includes('New password should be different')) {
        errorMessage = 'Новый пароль должен отличаться от текущего';
      } else if (err.message?.includes('Password should be at least')) {
        errorMessage = 'Пароль не соответствует требованиям безопасности';
      } else if (err.message?.includes('Invalid session')) {
        errorMessage = 'Сессия истекла. Запросите новую ссылку для сброса пароля';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast({
        title: "Ошибка обновления пароля",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Показываем загрузку пока проверяем сессию
  if (!sessionChecked) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-3 text-[#001D8D]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-lg font-medium">Проверка ссылки...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Показываем ошибку если нет валидной сессии
  if (!hasValidSession) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-red-200">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#001D8D] mb-4">
            Недействительная ссылка
          </h2>
          <p className="text-[#001D8D]/70 mb-6 leading-relaxed">
            {error || 'Ссылка для сброса пароля недействительна или истекла. Запросите новую ссылку.'}
          </p>
          <div className="space-y-3">
            <Link href="/forgot-password">
              <Button className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 text-white">
                Запросить новую ссылку
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="w-full text-[#001D8D]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться к входу
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Показываем успех
  if (success) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-green-200">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#001D8D] mb-4">
            Пароль обновлен!
          </h2>
          <p className="text-[#001D8D]/70 mb-6 leading-relaxed">
            Ваш пароль был успешно изменен. Теперь вы можете войти в аккаунт с новым паролем.
          </p>
          <p className="text-sm text-[#001D8D]/60 mb-6">
            Вы будете автоматически перенаправлены на страницу входа через несколько секунд...
          </p>
          <Link href="/login">
            <Button className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 text-white">
              Войти с новым паролем
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-[#001D8D] flex items-center justify-center gap-3">
          <Shield className="h-6 w-6" />
          Установка нового пароля
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-8 pt-0">
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Новый пароль */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#001D8D] font-medium">
              Новый пароль
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#001D8D]/60" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Минимум 6 символов"
                className={`pl-10 pr-10 border-[#001D8D]/20 focus:border-[#001D8D] ${
                  validationErrors.password ? 'border-red-300' : ''
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#001D8D]/60 hover:text-[#001D8D]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-600">{validationErrors.password}</p>
            )}
          </div>

          {/* Подтверждение пароля */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[#001D8D] font-medium">
              Подтвердите новый пароль
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#001D8D]/60" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Повторите новый пароль"
                className={`pl-10 pr-10 border-[#001D8D]/20 focus:border-[#001D8D] ${
                  validationErrors.confirmPassword ? 'border-red-300' : ''
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#001D8D]/60 hover:text-[#001D8D]"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-sm text-red-600">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {/* Кнопка обновления пароля */}
          <Button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 text-white py-3 text-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Обновление пароля...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                Установить новый пароль
              </>
            )}
          </Button>

          {/* Ссылка назад */}
          <div className="text-center pt-4">
            <Link 
              href="/login" 
              className="text-[#001D8D] hover:underline flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Вернуться к входу
            </Link>
          </div>
        </form>

        {/* Требования к паролю */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-[#001D8D] mb-2">
            Требования к паролю
          </h4>
          <ul className="text-xs text-[#001D8D]/70 space-y-1">
            <li className={`flex items-center gap-2 ${formData.password.length >= 6 ? 'text-green-600' : ''}`}>
              <CheckCircle className={`h-3 w-3 ${formData.password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`} />
              Минимум 6 символов
            </li>
            <li className={`flex items-center gap-2 ${formData.password === formData.confirmPassword && formData.password ? 'text-green-600' : ''}`}>
              <CheckCircle className={`h-3 w-3 ${formData.password === formData.confirmPassword && formData.password ? 'text-green-600' : 'text-gray-400'}`} />
              Пароли должны совпадать
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <Shield className="h-3 w-3 text-gray-400" />
              Используйте надежный пароль для защиты аккаунта
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}