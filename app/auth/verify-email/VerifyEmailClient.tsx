"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabaseAuth } from '@/lib/supabase/auth';

export function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [status, setStatus] = useState<'waiting' | 'success' | 'error'>('waiting');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Check if this is a verification callback
    const handleEmailVerification = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      
      if (token && type === 'email_verification') {
        try {
          // Verify the token with Supabase
          const { error } = await supabaseAuth.auth.verifyOtp({
            token_hash: token,
            type: 'email',
          });
          
          if (error) throw error;
          setStatus('success');
        } catch (error) {
          console.error('Verification error:', error);
          setStatus('error');
        }
      }
    };
    
    handleEmailVerification();
  }, [searchParams]);

  useEffect(() => {
    // Countdown for resend cooldown
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || !email) return;
    
    setIsResending(true);
    
    try {
      const { error } = await supabaseAuth.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      // Set cooldown to 60 seconds
      setResendCooldown(60);
    } catch (error) {
      console.error('Error resending verification email:', error);
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Verified Successfully</h1>
            <p className="text-gray-600 mb-6">
              Your email has been verified. You can now sign in to your account.
            </p>
            <Button asChild className="w-full bg-[#001D8D]">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h1>
            <p className="text-gray-600 mb-6">
              The verification link is invalid or has expired. Please request a new verification email.
            </p>
            <Button 
              onClick={handleResendVerification} 
              disabled={isResending || resendCooldown > 0}
              className="w-full bg-[#001D8D]"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend Email (${resendCooldown}s)`
              ) : (
                'Resend Verification Email'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-[#001D8D]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Email</h1>
          <p className="text-gray-600 mb-6">
            We've sent a verification email to <strong>{email}</strong>. 
            Please check your inbox and click the verification link to complete your registration.
          </p>
          <div className="space-y-4">
            <Button 
              onClick={handleResendVerification} 
              disabled={isResending || resendCooldown > 0}
              className="w-full bg-[#001D8D]"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend Email (${resendCooldown}s)`
              ) : (
                'Resend Verification Email'
              )}
            </Button>
            <div className="text-sm text-gray-500">
              Already verified? <Link href="/auth/login" className="text-[#001D8D] hover:underline">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}