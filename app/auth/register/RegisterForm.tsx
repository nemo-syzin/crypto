"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Loader2, 
  CheckCircle2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (!captchaToken) {
      toast({
        title: "CAPTCHA verification required",
        description: "Please complete the CAPTCHA verification to continue",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: authData, error } = await supabaseAuth.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });

      // Redirect to verification page
      router.push('/auth/verify-email?email=' + encodeURIComponent(data.email));
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message.includes('email')) {
        setError('email', { 
          type: 'manual', 
          message: error.message || 'This email is already registered or invalid' 
        });
      } else {
        toast({
          title: "Registration failed",
          description: error.message || "An error occurred during registration. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulated CAPTCHA verification (in a real app, use reCAPTCHA or hCaptcha)
  const handleCaptchaVerification = () => {
    // Simulate CAPTCHA verification
    setCaptchaToken('verified-' + Math.random().toString(36).substring(2));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="fullName"
              placeholder="John Doe"
              className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
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
          <Label htmlFor="confirmPassword">Confirm Password</Label>
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

        {/* Simulated CAPTCHA */}
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Verify you're human</span>
            {captchaToken ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                <span className="text-xs">Verified</span>
              </div>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleCaptchaVerification}
              >
                Verify
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" {...register('terms')} />
          <label
            htmlFor="terms"
            className={`text-sm ${errors.terms ? 'text-red-500' : 'text-gray-600'}`}
          >
            I agree to the{' '}
            <Link href="/policy/terms" className="text-[#001D8D] hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/policy/privacy" className="text-[#001D8D] hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-sm">{errors.terms.message}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-[#001D8D]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#001D8D] hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}