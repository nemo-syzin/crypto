import { Metadata } from 'next';
import { ResetPasswordForm } from './ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password - KenigSwap',
  description: 'Create a new password for your KenigSwap account.',
};

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#001D8D] mb-8">
          Create New Password
        </h1>
        <ResetPasswordForm />
      </div>
    </div>
  );
}