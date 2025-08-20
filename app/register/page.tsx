import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Регистрация – KenigSwap',
  description: 'Создайте аккаунт в KenigSwap для безопасного обмена криптовалют. Быстрая регистрация и верификация.',
  keywords: ['регистрация', 'создать аккаунт', 'KenigSwap', 'криптовалютный обмен', 'безопасность'],
  robots: {
    index: false, // Не индексируем страницы аутентификации
    follow: true,
  },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4">
              Создать аккаунт
            </h1>
            <p className="text-lg text-[#001D8D]/70 leading-relaxed">
              Присоединяйтесь к KenigSwap для безопасного обмена криптовалют
            </p>
          </div>
          
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}