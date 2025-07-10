import { Metadata } from 'next';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = {
  title: 'Register - KenigSwap',
  description: 'Create a new account on KenigSwap to access personalized features and secure transactions.',
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#001D8D] mb-8">
          Create an Account
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
}