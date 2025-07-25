import { createClient } from '@supabase/supabase-js';
import { isSupabaseAvailable } from './client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseAuth = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

const isAuthAvailable = () => isSupabaseAvailable();

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  notification_preferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  created_at?: string;
  updated_at?: string;
};

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isAuthAvailable()) return null;
  
  try {
    const { data, error } = await supabaseAuth
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  if (!isAuthAvailable()) return null;
  
  try {
    const { data, error } = await supabaseAuth
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  if (!isAuthAvailable()) return null;
  
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    const { error: uploadError } = await supabaseAuth.storage
      .from('user-avatars')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    const { data } = supabaseAuth.storage
      .from('user-avatars')
      .getPublicUrl(filePath);
    
    // Update user profile with new avatar URL
    await updateUserProfile(userId, { avatar_url: data.publicUrl });
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
}

async function logUserActivity(userId: string, action: string, details?: any): Promise<void> {
  if (!isAuthAvailable()) return;
  
  try {
    const { error } = await supabaseAuth
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        action,
        details,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error logging user activity:', error);
  }
}

export async function updateNotificationPreferences(
  userId: string, 
  preferences: { email: boolean; sms: boolean; push: boolean }
): Promise<boolean> {
  if (!isAuthAvailable()) return false;
  
  try {
    const { error } = await supabaseAuth
      .from('user_profiles')
      .update({ notification_preferences: preferences })
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return false;
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  if (!isAuthAvailable()) {
    return { success: false, message: 'Authentication service unavailable' };
  }
  
  try {
    const { error } = await supabaseAuth.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      message: 'Password updated successfully' 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to update password' 
    };
  }
}

export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  if (!isAuthAvailable()) {
    return { success: false, message: 'Authentication service unavailable' };
  }
  
  try {
    const { error } = await supabaseAuth.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      message: 'Password reset instructions sent to your email' 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to send password reset email' 
    };
  }
}

export async function enableTwoFactorAuth(userId: string): Promise<{ success: boolean; message: string; setupUrl?: string }> {
  if (!isAuthAvailable()) {
    return { success: false, message: 'Authentication service unavailable' };
  }
  
  try {
    // This is a placeholder - actual implementation would depend on Supabase's 2FA API
    // which may require additional setup or third-party integration
    return { 
      success: false, 
      message: 'Two-factor authentication setup requires additional configuration' 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to enable two-factor authentication' 
    };
  }
}

async function verifyTwoFactorToken(userId: string, token: string): Promise<boolean> {
  if (!isAuthAvailable()) return false;
  
  try {
    // This is a placeholder - actual implementation would depend on Supabase's 2FA API
    return false;
  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    return false;
  }
}