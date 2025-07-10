import { Metadata } from 'next';
import { VerifyEmailClient } from './VerifyEmailClient';

export const metadata: Metadata = {
  title: 'Verify Email - KenigSwap',
  description: 'Verify your email address to complete your KenigSwap account registration.',
};

export default function VerifyEmailPage() {
  return <VerifyEmailClient />;
}