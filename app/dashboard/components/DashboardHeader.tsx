"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabaseAuth, type UserProfile } from '@/lib/supabase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut, User, Settings, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardHeaderProps {
  user: any;
  profile: UserProfile | null;
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    
    try {
      await supabaseAuth.auth.signOut();
      
      toast({
        title: "Signed out successfully",
      });
      
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Card className="bg-white shadow-md border-[#001D8D]/10">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-[#001D8D]/10 flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || user.email}
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-[#001D8D]" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#001D8D]">
                {profile?.full_name || user.email.split('@')[0]}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-gray-600">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
            <Button variant="outline" size="sm" className="text-gray-600">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleSignOut}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}