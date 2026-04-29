"use client";

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Send
} from 'lucide-react';

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Валидация email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setValidationError('Введите email адрес');
      return false;
    } else if (!emailRegex.test(email)) {
      setValidationError('Введите корректный email адрес');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (validationError) setValidationError(null);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setSuccess(true);
      toast({
        title: "Письмо отправлено!",
        description: "Проверьте вашу электронную почту для получения ссылки на сброс пароля.",
      });
    } catch (err: any) {
      console.error('Password reset error:', err);
      
      // Обработка различных типов ошибок
      let errorMessage = 'Произошла ошибка при отправке письма';
      
      if (err.message?.includes('User not found')) {
        errorMessage = 'Пользователь с таким email не найден';
      } else if (err.message?.includes('Email rate limit exceeded')) {
        errorMessage = 'Слишком много запросов. Попробуйте позже';
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = 'Некорректный email адрес';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast({
        title: "Ошибка",
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
            Письмо отправлено!
          </h2>
          <p className="text-[#001D8D]/70 mb-6 leading-relaxed">
            Мы отправили письмо с инструкциями по сбросу пароля на адрес:
          </p>
          <div className="bg-blue-50 p-3 rounded-lg mb-6">
            <p className="font-semibold text-[#001D8D]">{email}</p>
          </div>
          <p className="text-sm text-[#001D8D]/60 mb-6">
            Проверьте папку "Спам", если письмо не пришло в течение нескольких минут.
            Ссылка для сброса пароля действительна в течение 1 часа.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              variant="outline"
              className="w-full text-[#001D8D] border-[#001D8D]/20"
            >
              Отправить письмо повторно
            </Button>
            <Link href="https://kenigswap.com/login/">
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

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-[#001D8D] flex items-center justify-center gap-3">
          <Mail className="h-6 w-6" />
          Восстановление пароля
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
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="your@email.com"
                className={`pl-10 border-[#001D8D]/20 focus:border-[#001D8D] ${
                  validationError ? 'border-red-300' : ''
                }`}
                disabled={loading}
              />
            </div>
            {validationError && (
              <p className="text-sm text-red-600">{validationError}</p>
            )}
            <p className="text-xs text-[#001D8D]/60">
              Введите email адрес, который вы использовали при регистрации
            </p>
          </div>

          {/* Кнопка отправки */}
          <Button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 text-white py-3 text-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Отправка письма...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Отправить ссылку для сброса
              </>
            )}
          </Button>

          {/* Ссылка назад */}
          <div className="text-center pt-4">
            <Link 
              href="https://kenigswap.com/login/" 
              className="text-[#001D8D] hover:underline flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Вернуться к входу
            </Link>
          </div>
        </form>

        {/* Информация о безопасности */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-[#001D8D] mb-2">
            Безопасность
          </h4>
          <ul className="text-xs text-[#001D8D]/70 space-y-1">
            <li>• Ссылка для сброса пароля действительна только 1 час</li>
            <li>• Ссылка может быть использована только один раз</li>
            <li>• Если вы не запрашивали сброс, просто проигнорируйте письмо</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
