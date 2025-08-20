import { Suspense } from 'react';
import { Metadata } from 'next';
import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm';

export const metadata: Metadata = {
  title: 'Установка нового пароля – KenigSwap',
  description: 'Установите новый пароль для вашего аккаунта KenigSwap. Завершите процесс восстановления пароля.',
  keywords: ['новый пароль', 'установка пароля', 'сброс пароля', 'KenigSwap', 'безопасность'],
  robots: {
    index: false, // Не индексируем страницы аутентификации
    follow: true,
  },
};

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4">
              Новый пароль
            </h1>
            <p className="text-lg text-[#001D8D]/70 leading-relaxed">
              Введите новый пароль для вашего аккаунта
            </p>
          </div>
          
          <Suspense fallback={
            <div className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20 rounded-lg p-8">
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-[#001D8D]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001D8D]"></div>
                  <span className="text-lg font-medium">Загрузка формы...</span>
                </div>
              </div>
            </div>
          }>
            <UpdatePasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}