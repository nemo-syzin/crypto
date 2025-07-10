import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/app/auth/register/RegisterForm';
import { UnifiedVantaBackground } from '@/components/shared/UnifiedVantaBackground';
import { CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Get Started - KenigSwap',
  description: 'Create a new account on KenigSwap to access personalized features and secure transactions.',
};

export default function GetStartedPage() {
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

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#001D8D] mb-4">
              Get Started with KenigSwap
            </h1>
            <p className="text-[#001D8D]/70 max-w-2xl mx-auto">
              Create your account to access personalized features, secure transactions, and the best exchange rates
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Benefits Section */}
            <div className="space-y-8">
              <div className="calculator-container">
                <h2 className="text-xl font-bold text-[#001D8D] mb-6">Why Join KenigSwap?</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-100 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#001D8D]">Best Exchange Rates</h3>
                      <p className="text-sm text-[#001D8D]/70">
                        Get the most competitive rates for your crypto exchanges, updated in real-time
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-100 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#001D8D]">Enhanced Security</h3>
                      <p className="text-sm text-[#001D8D]/70">
                        Protect your assets with our advanced security features including two-factor authentication
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-100 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#001D8D]">Transaction History</h3>
                      <p className="text-sm text-[#001D8D]/70">
                        Keep track of all your exchanges with detailed transaction history
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-100 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#001D8D]">Personalized Experience</h3>
                      <p className="text-sm text-[#001D8D]/70">
                        Customize your dashboard and notification preferences to suit your needs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="calculator-container">
                <h2 className="text-xl font-bold text-[#001D8D] mb-6">Already have an account?</h2>
                <p className="text-[#001D8D]/70 mb-4">
                  If you already have a KenigSwap account, you can sign in to access your dashboard.
                </p>
                <Link 
                  href="/login" 
                  className="inline-block w-full py-3 px-4 bg-white border border-[#001D8D] text-[#001D8D] font-semibold rounded-lg text-center hover:bg-[#001D8D]/5 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
            
            {/* Registration Form */}
            <div>
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}