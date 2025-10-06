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
import { User, Mail, Lock, Eye, EyeOff, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Loader as Loader2 } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({});

  // Валидация формы
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    // Проверка имени
    if (!formData.fullName.trim()) {
      errors.fullName = 'Введите ваше полное имя';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Имя должно содержать минимум 2 символа';
    }

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
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }

    // Проверка подтверждения пароля
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
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
      const { data, error: signUpError } = await supabaseBrowser.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        setSuccess(true);
        toast({
          title: "Регистрация успешна!",
          description: "Проверьте вашу электронную почту для подтверждения аккаунта.",
        });

        // Перенаправляем на страницу входа через 3 секунды
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Обработка различных типов ошибок
      let errorMessage = 'Произошла ошибка при регистрации';
      
      if (err.message?.includes('User already registered')) {
        errorMessage = 'Пользователь с таким email уже зарегистрирован';
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = 'Некорректный email адрес';
      } else if (err.message?.includes('Password')) {
        errorMessage = 'Пароль не соответствует требованиям безопасности';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast({
        title: "Ошибка регистрации",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            Регистрация завершена!
          </h2>
          <p className="text-[#001D8D]/70 mb-6 leading-relaxed">
            Мы отправили письмо с подтверждением на ваш email адрес. 
            Пожалуйста, проверьте почту и перейдите по ссылке для активации аккаунта.
          </p>
          <p className="text-sm text-[#001D8D]/60">
            Вы будете автоматически перенаправлены на страницу входа через несколько секунд...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-[#001D8D] flex items-center justify-center gap-3">
          <User className="h-6 w-6" />
          Создание аккаунта
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
          {/* Полное имя */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-[#001D8D] font-medium">
              Полное имя
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#001D8D]/60" />
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Введите ваше полное имя"
                className={`pl-10 border-[#001D8D]/20 focus:border-[#001D8D] ${
                  validationErrors.fullName ? 'border-red-300' : ''
                }`}
                disabled={loading}
              />
            </div>
            {validationErrors.fullName && (
              <p className="text-sm text-red-600">{validationErrors.fullName}</p>
            )}
          </div>

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
              Подтвердите пароль
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#001D8D]/60" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Повторите пароль"
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

          {/* Кнопка регистрации */}
          <Button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 text-white py-3 text-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Создание аккаунта...
              </>
            ) : (
              'Создать аккаунт'
            )}
          </Button>

          {/* Ссылка на вход */}
          <div className="text-center pt-4">
            <p className="text-[#001D8D]/70">
              Уже есть аккаунт?{' '}
              <Link 
                href="/login" 
                className="text-[#001D8D] font-semibold hover:underline"
              >
                Войти
              </Link>
            </p>
          </div>
        </form>

        {/* Информация о безопасности */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-[#001D8D] mb-2">
            Безопасность ваших данных
          </h4>
          <ul className="text-xs text-[#001D8D]/70 space-y-1">
            <li>• Все данные защищены современным шифрованием</li>
            <li>• Мы соблюдаем требования GDPR и российского законодательства</li>
            <li>• Ваши персональные данные не передаются третьим лицам</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}