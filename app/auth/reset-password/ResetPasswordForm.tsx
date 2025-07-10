"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabaseAuth } from '@/lib/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Lock, Eye, EyeOff, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setIsTokenValid(false);
        setIsCheckingToken(false);
        return;
      }
      
      try {
        // Verify the token with Supabase
        const { error } = await supabaseAuth.auth.verifyOtp({
          token_hash: token,
          type: 'recovery',
        });
        
        if (error) throw error;
        setIsTokenValid(true);
      } catch (error) {
        console.error('Token verification error:', error);
        setIsTokenValid(false);
      } finally {
        setIsCheckingToken(false);
      }
    };
    
    verifyToken();
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabaseAuth.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;
      
      setIsSuccess(true);
      
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now sign in with your new password.",
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred while resetting your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#001D8D]" />
        <p className="text-gray-600">Verifying your reset link...</p>
      </div>
    );
  }

  if (isTokenValid === false) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid or Expired Link</h2>
        <p className="text-gray-600 mb-6">
          The password reset link is invalid or has expired. Please request a new password reset link.
        </p>
        <Button asChild className="w-full bg-[#001D8D]">
          <Link href="/auth/forgot-password">Request New Link</Link>
        </Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful</h2>
        <p className="text-gray-600 mb-6">
          Your password has been updated successfully. You will be redirected to the login page shortly.
        </p>
        <Button asChild className="w-full bg-[#001D8D]">
          <Link href="/auth/login">Sign In Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <p className="text-gray-600 mb-6">
        Create a new password for your account. Your password must be at least 8 characters long and include uppercase, lowercase, and numbers.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
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
              Updating password...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          <Link href="/auth/login" className="text-[#001D8D] hover:underline">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}