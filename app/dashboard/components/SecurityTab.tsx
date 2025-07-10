"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { changePassword, enableTwoFactorAuth } from '@/lib/supabase/auth';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle, 
  Shield, 
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityTabProps {
  user: any;
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function SecurityTab({ user }: SecurityTabProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [setupUrl, setSetupUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);

    try {
      const result = await changePassword(data.currentPassword, data.newPassword);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
      
      reset();
    } catch (error: any) {
      console.error('Password change error:', error);
      
      toast({
        title: "Password change failed",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FAToggle = async (enabled: boolean) => {
    if (enabled === is2FAEnabled) return;
    
    if (enabled) {
      setIsEnabling2FA(true);
      
      try {
        const result = await enableTwoFactorAuth(user.id);
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        if (result.setupUrl) {
          setSetupUrl(result.setupUrl);
        }
        
        setIs2FAEnabled(true);
        
        toast({
          title: "Two-factor authentication enabled",
          description: "Your account is now more secure with 2FA",
        });
      } catch (error: any) {
        console.error('2FA setup error:', error);
        
        toast({
          title: "2FA setup failed",
          description: error.message || "Failed to enable two-factor authentication. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsEnabling2FA(false);
      }
    } else {
      // Disable 2FA (placeholder - actual implementation would depend on Supabase's 2FA API)
      setIs2FAEnabled(false);
      setSetupUrl(null);
      
      toast({
        title: "Two-factor authentication disabled",
        description: "2FA has been turned off for your account",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#001D8D]/10">
              <Lock className="h-5 w-5 text-[#001D8D]" />
            </div>
            <h2 className="text-xl font-bold text-[#001D8D]">Change Password</h2>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={errors.currentPassword ? 'border-red-500' : ''}
                  {...register('currentPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={errors.newPassword ? 'border-red-500' : ''}
                  {...register('newPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
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
            
            <div className="pt-2">
              <Button
                type="submit"
                className="bg-[#001D8D]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Two-Factor Authentication */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#001D8D]/10">
              <Shield className="h-5 w-5 text-[#001D8D]" />
            </div>
            <h2 className="text-xl font-bold text-[#001D8D]">Two-Factor Authentication</h2>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-medium text-gray-900">Enhance your account security</h3>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
            </div>
            <Switch
              checked={is2FAEnabled}
              onCheckedChange={handle2FAToggle}
              disabled={isEnabling2FA}
            />
          </div>
          
          {isEnabling2FA && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-[#001D8D]" />
            </div>
          )}
          
          {is2FAEnabled && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="font-medium">Two-factor authentication is enabled</p>
                <p className="text-sm">Your account is now protected with an additional layer of security.</p>
              </div>
            </Alert>
          )}
          
          {setupUrl && (
            <div className="mt-4 p-4 border border-[#001D8D]/20 rounded-lg bg-[#001D8D]/5">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="h-5 w-5 text-[#001D8D]" />
                <h3 className="font-medium text-[#001D8D]">Set up authenticator app</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan the QR code below with your authenticator app (like Google Authenticator or Authy).
              </p>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <img src={setupUrl} alt="2FA QR Code" className="w-48 h-48" />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                After scanning, enter the 6-digit code from your app to verify setup.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Account Activity */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#001D8D]/10">
              <AlertTriangle className="h-5 w-5 text-[#001D8D]" />
            </div>
            <h2 className="text-xl font-bold text-[#001D8D]">Account Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Session Management</h3>
                <p className="text-sm text-gray-600">
                  View and manage your active sessions across devices.
                </p>
              </div>
              <Button variant="outline">Manage Sessions</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Login History</h3>
                <p className="text-sm text-gray-600">
                  Review recent login attempts to your account.
                </p>
              </div>
              <Button variant="outline">View History</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-red-600">Delete Account</h3>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}