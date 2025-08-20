import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Восстановление пароля – KenigSwap',
  description: 'Восстановите доступ к вашему аккаунту KenigSwap. Введите email для получения ссылки на сброс пароля.',
  keywords: ['восстановление пароля', 'забыли пароль', 'сброс пароля', 'KenigSwap', 'доступ к аккаунту'],
  robots: {
    index: false, // Не индексируем страницы аутентификации
    follow: true,
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4">
              Восстановление пароля
            </h1>
            <p className="text-lg text-[#001D8D]/70 leading-relaxed">
              Введите ваш email адрес и мы отправим ссылку для сброса пароля
            </p>
          </div>
          
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}