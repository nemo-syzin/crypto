"use client";

import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (isLocked) {
      toast({
        title: "Account temporarily locked",
        description: `Too many failed attempts. Please try again in ${Math.ceil((lockoutTime! - Date.now()) / 1000 / 60)} minutes.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: authData, error } = await supabaseAuth.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      // Reset login attempts on successful login
      setLoginAttempts(0);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Redirect to dashboard or requested page
      router.push(redirectTo);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        const lockoutDuration = 15 * 60 * 1000; // 15 minutes
        setIsLocked(true);
        setLockoutTime(Date.now() + lockoutDuration);
        
        // Set a timer to unlock
        setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
          setLockoutTime(null);
        }, lockoutDuration);
        
        toast({
          title: "Account temporarily locked",
          description: "Too many failed login attempts. Please try again in 15 minutes.",
          variant: "destructive",
        });
      } else {
        if (error.message.includes('credentials')) {
          setError('email', { 
            type: 'manual', 
            message: 'Invalid email or password' 
          });
          setError('password', { 
            type: 'manual', 
            message: 'Invalid email or password' 
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message || "An error occurred during login. Please try again.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      {isLocked && lockoutTime && (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <div className="ml-2">
            <p className="font-medium">Account temporarily locked</p>
            <p className="text-sm">
              Too many failed login attempts. Please try again in {Math.ceil((lockoutTime - Date.now()) / 1000 / 60)} minutes.
            </p>
          </div>
        </Alert>
      )}

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
              disabled={isLocked}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/auth/forgot-password" className="text-sm text-[#001D8D] hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
              {...register('password')}
              disabled={isLocked}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLocked}
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

        <div className="flex items-center space-x-2">
          <Checkbox id="rememberMe" {...register('rememberMe')} disabled={isLocked} />
          <label htmlFor="rememberMe" className="text-sm text-gray-600">
            Remember me for 30 days
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#001D8D]"
          disabled={isSubmitting || isLocked}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-[#001D8D] hover:underline">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}