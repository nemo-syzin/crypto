"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { updateNotificationPreferences, type UserProfile } from '@/lib/supabase/auth';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Loader2, 
  CheckCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationsTabProps {
  userId: string;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
}

export function NotificationsTab({ userId, profile, setProfile }: NotificationsTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferences, setPreferences] = useState({
    email: profile?.notification_preferences?.email ?? true,
    sms: profile?.notification_preferences?.sms ?? false,
    push: profile?.notification_preferences?.push ?? true,
  });
  const { toast } = useToast();

  const handleToggle = (key: 'email' | 'sms' | 'push') => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      const success = await updateNotificationPreferences(userId, preferences);
      
      if (!success) throw new Error("Failed to update notification preferences");
      
      // Update profile state
      if (profile) {
        setProfile({
          ...profile,
          notification_preferences: preferences,
        });
      }
      
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved",
      });
    } catch (error: any) {
      console.error('Notification preferences update error:', error);
      
      toast({
        title: "Update failed",
        description: error.message || "Failed to update notification preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[#001D8D]/10">
            <Bell className="h-5 w-5 text-[#001D8D]" />
          </div>
          <h2 className="text-xl font-bold text-[#001D8D]">Notification Preferences</h2>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">
                  Receive updates, security alerts, and newsletters via email
                </p>
              </div>
            </div>
            <Switch 
              checked={preferences.email} 
              onCheckedChange={() => handleToggle('email')}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <Smartphone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-600">
                  Get important alerts and verification codes via text message
                </p>
              </div>
            </div>
            <Switch 
              checked={preferences.sms} 
              onCheckedChange={() => handleToggle('sms')}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-100">
                <MessageSquare className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-600">
                  Receive real-time updates and alerts on your devices
                </p>
              </div>
            </div>
            <Switch 
              checked={preferences.push} 
              onCheckedChange={() => handleToggle('push')}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="pt-4">
            <Button
              onClick={handleSave}
              className="bg-[#001D8D]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}