"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseAuth, getUserProfile, type UserProfile } from '@/lib/supabase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { ProfileTab } from './components/ProfileTab';
import { SecurityTab } from './components/SecurityTab';
import { ActivityTab } from './components/ActivityTab';
import { NotificationsTab } from './components/NotificationsTab';
import { DashboardHeader } from './components/DashboardHeader';

export function DashboardClient() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabaseAuth.auth.getUser();
        
        if (!user) {
          router.push('/auth/login?redirectTo=/dashboard');
          return;
        }
        
        setUser(user);
        
        // Fetch user profile
        if (user.id) {
          const userProfile = await getUserProfile(user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        router.push('/auth/login?redirectTo=/dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#001D8D]" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <DashboardHeader user={user} profile={profile} />
      
      <div className="mt-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileTab user={user} profile={profile} setProfile={setProfile} />
          </TabsContent>
          
          <TabsContent value="security">
            <SecurityTab user={user} />
          </TabsContent>
          
          <TabsContent value="activity">
            <ActivityTab userId={user.id} />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationsTab userId={user.id} profile={profile} setProfile={setProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}