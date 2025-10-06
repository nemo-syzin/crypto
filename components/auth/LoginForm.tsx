"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Mail, Lock, Eye, EyeOff, CircleAlert as AlertCircle, Loader as Loader2 } from 'lucide-react';

interface LoginData {
  email: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });

  const [validationErrors, setValidationErrors] = useState<Partial<LoginData>>({});

  // Валидация формы
  const validateForm = (): boolean => {
    const errors: Partial<LoginData> = {};

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Введите email адрес';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Введите корректный email адрес';
    }

    // Проверка пароля
    if (!formData.password) {
      errors.password = 'Введите пароль';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof LoginData, value: string) => {
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
      const { data, error: signInError } = await supabaseBrowser.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        toast({
          title: "Вход выполнен успешно!",
          description: "Добро пожаловать в KenigSwap.",
        });

        // Перенаправляем в личный кабинет или на главную страницу
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Обработка различных типов ошибок
      let errorMessage = 'Произошла ошибка при входе';
      
      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Неверный email или пароль';
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Пожалуйста, подтвердите ваш email адрес';
      } else if (err.message?.includes('Too many requests')) {
        errorMessage = 'Слишком много попыток входа. Попробуйте позже';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast({
        title: "Ошибка входа",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-[#001D8D] flex items-center justify-center gap-3">
          <LogIn className="h-6 w-6" />
          Вход в аккаунт
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
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#001D8D] font-medium">
              Email адрес
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#001D8D]/60" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className={`pl-10 border-[#001D8D]/20 focus:border-[#001D8D] ${
                  validationErrors.email ? 'border-red-300' : ''
                }`}
                disabled={loading}
              />
            </div>
            {validationErrors.email && (
              <p className="text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          {/* Пароль */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#001D8D] font-medium">
              Пароль
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#001D8D]/60" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Введите ваш пароль"
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

          {/* Забыли пароль */}
          <div className="text-right">
            <Link 
              href="/forgot-password"
              className="text-sm text-[#001D8D] hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>

          {/* Кнопка входа */}
          <Button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 text-white py-3 text-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Вход...
              </>
            ) : (
              'Войти'
            )}
          </Button>

          {/* Ссылка на регистрацию */}
          <div className="text-center pt-4">
            <p className="text-[#001D8D]/70">
              Нет аккаунта?{' '}
              <Link 
                href="/register" 
                className="text-[#001D8D] font-semibold hover:underline"
              >
                Создать аккаунт
              </Link>
            </p>
          </div>
        </form>

        {/* Информация о безопасности */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-[#001D8D] mb-2">
            Безопасный вход
          </h4>
          <ul className="text-xs text-[#001D8D]/70 space-y-1">
            <li>• Все данные передаются по защищенному соединению</li>
            <li>• Мы не храним ваши пароли в открытом виде</li>
            <li>• Система автоматически отслеживает подозрительную активность</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}