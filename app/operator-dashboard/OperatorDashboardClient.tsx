"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Users, 
  Clock, 
  Send, 
  User, 
  Bot,
  CheckCircle,
  AlertCircle,
  Loader2,
  LogOut,
  RefreshCw,
  X,
  Phone,
  Mail,
  Calendar,
  Activity,
  Settings,
  Eye,
  MessageSquare,
  UserCheck,
  Shield
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { ChatSession, ChatMessage, ChatOperator } from '@/lib/chat';

interface ExtendedChatSession extends ChatSession {
  unread_count?: number;
  last_message?: ChatMessage;
}

export function OperatorDashboardClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [operator, setOperator] = useState<ChatOperator | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<ExtendedChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ExtendedChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<any>(null);

  // Проверка аутентификации и статуса оператора
  useEffect(() => {
    checkOperatorAuth();
  }, []);

  // Подписка на новые сообщения для выбранной сессии
  useEffect(() => {
    if (selectedSession) {
      loadSessionMessages(selectedSession.id);
      subscribeToSessionMessages(selectedSession.id);
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [selectedSession]);

  // Автоматическая прокрутка к последнему сообщению
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkOperatorAuth = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Проверяем, является ли пользователь оператором
      const { data: operatorData, error: operatorError } = await supabase
        .from('chat_operators')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (operatorError || !operatorData) {
        toast({
          title: "Доступ запрещен",
          description: "У вас нет прав доступа к панели оператора",
          variant: "destructive",
        });
        router.push('/');
        return;
      }

      setOperator(operatorData);
      
      // Устанавливаем статус "онлайн"
      await supabase
        .from('chat_operators')
        .update({ is_online: true, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      // Загружаем активные сессии
      loadActiveSessions();
    } catch (error) {
      console.error('Ошибка проверки аутентификации:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadActiveSessions = async () => {
    setSessionsLoading(true);
    try {
      const { data: sessionsData, error } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          chat_messages (
            id,
            message,
            sender_type,
            created_at
          )
        `)
        .in('status', ['waiting', 'active'])
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Обрабатываем данные для добавления информации о последних сообщениях
      const processedSessions = (sessionsData || []).map(session => {
        const sessionMessages = session.chat_messages || [];
        const lastMessage = sessionMessages.length > 0 
          ? sessionMessages[sessionMessages.length - 1] 
          : null;
        
        const unreadCount = sessionMessages.filter(msg => 
          msg.sender_type === 'user' && !msg.read_at
        ).length;

        return {
          ...session,
          last_message: lastMessage,
          unread_count: unreadCount
        };
      });

      setSessions(processedSessions);
      console.log('✅ Загружено сессий:', processedSessions.length);
    } catch (error) {
      console.error('❌ Ошибка загрузки сессий:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить активные чаты",
        variant: "destructive",
      });
    } finally {
      setSessionsLoading(false);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const { data: messagesData, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      setMessages(messagesData || []);
    } catch (error) {
      console.error('❌ Ошибка загрузки сообщений:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить сообщения",
        variant: "destructive",
      });
    }
  };

  const subscribeToSessionMessages = (sessionId: string) => {
    // Отписываемся от предыдущей подписки
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Подписываемся на новые сообщения
    subscriptionRef.current = supabase
      .channel(`operator-messages-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          console.log('Новое сообщение получено:', payload.new);
          setMessages(prev => [...prev, payload.new as ChatMessage]);
          
          // Обновляем список сессий
          loadActiveSessions();
        }
      )
      .subscribe((status) => {
        console.log('Статус подписки на сообщения:', status);
      });
  };

  const sendOperatorMessage = async () => {
    if (!newMessage.trim() || !selectedSession || !user) return;

    setSendingMessage(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const { data: sentMessage, error } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: selectedSession.id,
          sender_id: user.id,
          sender_type: 'operator',
          message: messageText,
          message_type: 'text'
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Обновляем статус сессии на "активная"
      if (selectedSession.status === 'waiting') {
        await supabase
          .from('chat_sessions')
          .update({ 
            status: 'active',
            operator_id: user.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedSession.id);

        // Обновляем локальное состояние
        setSelectedSession(prev => prev ? { ...prev, status: 'active', operator_id: user.id } : null);
      }

      console.log('✅ Сообщение отправлено:', sentMessage);
    } catch (error) {
      console.error('❌ Ошибка отправки сообщения:', error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
      setNewMessage(messageText); // Возвращаем текст в поле
    } finally {
      setSendingMessage(false);
    }
  };

  const closeSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ 
          status: 'closed',
          closed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        throw error;
      }

      // Обновляем список сессий
      loadActiveSessions();
      
      // Если закрываем текущую выбранную сессию, сбрасываем выбор
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
        setMessages([]);
      }

      toast({
        title: "Сессия закрыта",
        description: "Чат с клиентом успешно завершен",
      });
    } catch (error) {
      console.error('❌ Ошибка закрытия сессии:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось закрыть сессию",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      // Устанавливаем статус "оффлайн"
      if (user) {
        await supabase
          .from('chat_operators')
          .update({ is_online: false })
          .eq('user_id', user.id);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      router.push('/');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendOperatorMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/10 to-blue-100/20 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#001D8D]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg font-medium">Загрузка панели оператора...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/10 to-blue-100/20 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#001D8D] mb-2">
                Панель оператора
              </h1>
              <p className="text-lg text-[#001D8D]/70">
                Добро пожаловать, {operator?.name || 'Оператор'}!
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-[#001D8D]/70">Онлайн</span>
              </div>
              
              <Button
                onClick={loadActiveSessions}
                disabled={sessionsLoading}
                variant="outline"
                className="text-[#001D8D] border-[#001D8D]/20"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${sessionsLoading ? 'animate-spin' : ''}`} />
                Обновить
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-[#001D8D] mb-1">
                  {sessions.filter(s => s.status === 'waiting').length}
                </div>
                <div className="text-sm text-[#001D8D]/70">Ожидают ответа</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-[#001D8D] mb-1">
                  {sessions.filter(s => s.status === 'active').length}
                </div>
                <div className="text-sm text-[#001D8D]/70">Активные чаты</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-[#001D8D] mb-1">
                  {sessions.reduce((sum, s) => sum + (s.unread_count || 0), 0)}
                </div>
                <div className="text-sm text-[#001D8D]/70">Непрочитанных</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-[#001D8D]/10">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-[#001D8D] mb-1">
                  {sessions.length}
                </div>
                <div className="text-sm text-[#001D8D]/70">Всего сессий</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Левая колонка - Список сессий */}
            <div className="lg:col-span-1">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20 h-[600px] flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-[#001D8D] flex items-center gap-3">
                    <Users className="h-6 w-6" />
                    Активные чаты ({sessions.length})
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-0">
                  {sessionsLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center gap-3 text-[#001D8D]">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Загрузка чатов...</span>
                      </div>
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center p-6">
                      <div>
                        <MessageCircle className="h-12 w-12 text-[#001D8D]/40 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-[#001D8D] mb-2">
                          Нет активных чатов
                        </h3>
                        <p className="text-[#001D8D]/70">
                          Новые обращения клиентов появятся здесь
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          onClick={() => setSelectedSession(session)}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                            selectedSession?.id === session.id
                              ? 'bg-[#001D8D]/10 border-[#001D8D]/30'
                              : 'bg-white hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-[#001D8D]/10 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-[#001D8D]" />
                              </div>
                              <div>
                                <div className="font-semibold text-[#001D8D] text-sm">
                                  {session.user_name || 'Анонимный пользователь'}
                                </div>
                                <div className="text-xs text-[#001D8D]/60">
                                  {session.user_email}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-1">
                              <Badge className={`text-xs ${
                                session.status === 'waiting' 
                                  ? 'bg-orange-100 text-orange-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {session.status === 'waiting' ? 'Ожидает' : 'Активный'}
                              </Badge>
                              
                              {(session.unread_count || 0) > 0 && (
                                <Badge className="bg-red-500 text-white text-xs">
                                  {session.unread_count}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {session.last_message && (
                            <div className="text-xs text-[#001D8D]/70 truncate">
                              <strong>
                                {session.last_message.sender_type === 'user' ? 'Клиент' : 'Вы'}:
                              </strong> {session.last_message.message}
                            </div>
                          )}
                          
                          <div className="text-xs text-[#001D8D]/50 mt-2">
                            {formatDate(session.updated_at)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Правая колонка - Чат */}
            <div className="lg:col-span-2">
              {selectedSession ? (
                <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20 h-[600px] flex flex-col">
                  {/* Header чата */}
                  <CardHeader className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#001D8D]/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-[#001D8D]" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-[#001D8D]">
                            {selectedSession.user_name || 'Анонимный пользователь'}
                          </CardTitle>
                          <div className="text-sm text-[#001D8D]/70 flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {selectedSession.user_email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(selectedSession.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          selectedSession.status === 'waiting' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedSession.status === 'waiting' ? 'Ожидает ответа' : 'Активный чат'}
                        </Badge>
                        
                        <Button
                          onClick={() => closeSession(selectedSession.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Закрыть
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Область сообщений */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MessageSquare className="h-12 w-12 text-[#001D8D]/40 mx-auto mb-4" />
                          <p className="text-[#001D8D]/70">Сообщений пока нет</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_type === 'operator' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] ${message.sender_type === 'operator' ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`p-3 rounded-lg ${
                                  message.sender_type === 'operator'
                                    ? 'bg-[#001D8D] text-white'
                                    : 'bg-gray-100 text-[#001D8D]'
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                              </div>
                              <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                                message.sender_type === 'operator' ? 'justify-end' : 'justify-start'
                              }`}>
                                <span>{formatTime(message.created_at)}</span>
                                {message.sender_type === 'operator' && (
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                )}
                              </div>
                            </div>
                            
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.sender_type === 'operator' ? 'order-1 ml-2' : 'order-2 mr-2'
                            }`}>
                              {message.sender_type === 'operator' ? (
                                <div className="w-8 h-8 bg-[#001D8D] rounded-full flex items-center justify-center">
                                  <UserCheck className="h-4 w-4 text-white" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-600" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </CardContent>

                  {/* Поле ввода сообщения */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Введите ответ клиенту..."
                          className="border-[#001D8D]/20 focus:border-[#001D8D]"
                          disabled={sendingMessage}
                        />
                      </div>
                      <Button
                        onClick={sendOperatorMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                        className="bg-[#001D8D] hover:bg-[#001D8D]/90 text-white p-3"
                      >
                        {sendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="text-xs text-[#001D8D]/60 mt-2">
                      Нажмите Enter для отправки сообщения
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-[#001D8D]/20 h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-[#001D8D]/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#001D8D] mb-2">
                      Выберите чат
                    </h3>
                    <p className="text-[#001D8D]/70">
                      Выберите сессию из списка слева, чтобы начать общение с клиентом
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}