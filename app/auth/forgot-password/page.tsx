import { Metadata } from 'next';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password - KenigSwap',
  description: 'Reset your KenigSwap account password.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#001D8D] mb-8">
          Reset Your Password
        </h1>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}