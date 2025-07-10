import { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Login - KenigSwap',
  description: 'Sign in to your KenigSwap account to access your dashboard and manage your transactions.',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#001D8D] mb-8">
          Sign In to Your Account
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}