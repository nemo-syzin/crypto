import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Вход – KenigSwap',
  description: 'Войдите в свой аккаунт KenigSwap для доступа к личному кабинету и обмену криптовалют.',
  keywords: ['вход', 'логин', 'личный кабинет', 'KenigSwap', 'аутентификация'],
  robots: {
    index: false, // Не индексируем страницы аутентификации
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#001D8D] mb-4">
              Вход в аккаунт
            </h1>
            <p className="text-lg text-[#001D8D]/70 leading-relaxed">
              Войдите в свой личный кабинет KenigSwap
            </p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}