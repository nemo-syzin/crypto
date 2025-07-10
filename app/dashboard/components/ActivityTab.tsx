"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabaseAuth } from '@/lib/supabase/auth';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  Settings, 
  UserPlus, 
  ShieldCheck, 
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  details: any;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

interface ActivityTabProps {
  userId: string;
}

export function ActivityTab({ userId }: ActivityTabProps) {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const { data, error } = await supabaseAuth
          .from('user_activity_logs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (error) throw error;
        
        setActivityLogs(data || []);
      } catch (error: any) {
        console.error('Error fetching activity logs:', error);
        setError(error.message || 'Failed to load activity logs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivityLogs();
  }, [userId]);

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'login':
        return <LogIn className="h-4 w-4 text-green-600" />;
      case 'logout':
        return <LogOut className="h-4 w-4 text-orange-600" />;
      case 'profile_update':
        return <Settings className="h-4 w-4 text-blue-600" />;
      case 'signup':
        return <UserPlus className="h-4 w-4 text-purple-600" />;
      case 'password_change':
        return <ShieldCheck className="h-4 w-4 text-indigo-600" />;
      case 'failed_login':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatActivityAction = (action: string): string => {
    switch (action) {
      case 'login':
        return 'Signed in';
      case 'logout':
        return 'Signed out';
      case 'profile_update':
        return 'Updated profile';
      case 'signup':
        return 'Created account';
      case 'password_change':
        return 'Changed password';
      case 'failed_login':
        return 'Failed login attempt';
      default:
        return action.replace(/_/g, ' ');
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#001D8D]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-[#001D8D] mb-6">Account Activity</h2>
        
        {activityLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 border-b border-gray-100 last:border-0">
                <div className="p-2 rounded-full bg-gray-100">
                  {getActivityIcon(log.action)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatActivityAction(log.action)}
                      </p>
                      {log.details && (
                        <p className="text-sm text-gray-600 mt-1">
                          {typeof log.details === 'object' 
                            ? JSON.stringify(log.details) 
                            : log.details}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(log.created_at)}
                    </p>
                  </div>
                  {log.ip_address && (
                    <p className="text-xs text-gray-500 mt-2">
                      IP: {log.ip_address}
                      {log.user_agent && ` • ${log.user_agent.split(' ')[0]}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}