"use client";

import { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabaseAuth, requestPasswordReset } from '@/lib/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);

    try {
      const { success, message } = await requestPasswordReset(data.email);

      if (!success) {
        throw new Error(message);
      }

      setIsSubmitted(true);
      setSubmittedEmail(data.email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      setError('email', { 
        type: 'manual', 
        message: error.message || 'Failed to send reset email. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
        <p className="text-gray-600 mb-6">
          We've sent password reset instructions to <strong>{submittedEmail}</strong>.
          Please check your inbox and follow the link to reset your password.
        </p>
        <div className="space-y-4">
          <Button 
            asChild
            variant="outline" 
            className="w-full"
          >
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
          <p className="text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or{' '}
            <button 
              type="button"
              className="text-[#001D8D] hover:underline"
              onClick={() => setIsSubmitted(false)}
            >
              try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <p className="text-gray-600 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#001D8D]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          <Link href="/auth/login" className="text-[#001D8D] hover:underline">
            <ArrowLeft className="inline mr-1 h-3 w-3" />
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}