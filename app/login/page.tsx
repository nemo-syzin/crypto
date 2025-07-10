import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/app/auth/login/LoginForm';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';

export const metadata: Metadata = {
  title: 'Login - KenigSwap',
  description: 'Sign in to your KenigSwap account to access your dashboard and manage your transactions.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-15">
        <UnifiedVantaBackground 
          type="topology"
          color={0x94bdff}
          color2={0xFF6B35}
          backgroundColor={0xffffff}
          points={15}
          maxDistance={20}
          spacing={16}
          showDots={true}
          speed={1.4}
          mouseControls={true}
          touchControls={true}
          forceAnimate={true}
        />
      </div>

      {/* Gradient transitions */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-5" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-blue-100/20 z-5" />

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#001D8D] mb-4">
              Welcome Back
            </h1>
            <p className="text-[#001D8D]/70">
              Sign in to your account to access your dashboard and manage your transactions
            </p>
          </div>
          
          <LoginForm />
          
          <div className="mt-8 text-center">
            <p className="text-[#001D8D]/70">
              Don't have an account yet?{' '}
              <Link href="/get-started" className="text-[#001D8D] font-semibold hover:underline">
                Get Started
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}