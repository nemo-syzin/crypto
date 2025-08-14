import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

export interface ChatSession {
  id: string;
  user_id: string | null;
  operator_id: string | null;
  status: 'waiting' | 'active' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user_name: string | null;
  user_email: string | null;
  initial_message: string | null;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_id: string | null;
  sender_type: 'user' | 'operator' | 'system';
  message: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  created_at: string;
  read_at: string | null;
  metadata: any;
}

export interface ChatOperator {
  id: string;
  user_id: string;
  name: string;
  email: string;
  is_online: boolean;
  max_concurrent_chats: number;
  created_at: string;
  updated_at: string;
}

// Создание новой сессии чата
export async function createChatSession(
  userName: string,
): Promise<{ session: ChatSession | null; error: string | null }> {
  if (!isSupabaseAvailable()) {
    return { session: null, error: 'Чат временно недоступен' };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const sessionData = {
      user_id: user?.id || null,
      user_name: userName,
      status: 'waiting' as const
    };

    const { data: session, error } = await supabase
      .from('chat_sessions')
      .insert([sessionData])
      .select()
      .single();

    if (error) {
      console.error('Ошибка при создании сессии чата:', error);
      return { session: null, error: 'Не удалось создать сессию чата' };
    }

    return { session, error: null };
  } catch (error) {
    console.error('Ошибка при создании сессии чата:', error);
    return { session: null, error: 'Произошла ошибка при создании чата' };
  }
}

// Отправка сообщения
export async function sendMessage(
  sessionId: string,
  message: string,
  senderType: 'user' | 'operator' | 'system',
  senderId?: string
): Promise<{ message: ChatMessage | null; error: string | null }> {
  if (!isSupabaseAvailable()) {
    return { message: null, error: 'Чат временно недоступен' };
  }

  try {
    const messageData = {
      session_id: sessionId,
      sender_id: senderId || null,
      sender_type: senderType,
      message: message.trim(),
      message_type: 'text' as const
    };

    const { data: newMessage, error } = await supabase
      .from('chat_messages')
      .insert([messageData])
      .select()
      .single();

    if (error) {
      console.error('Ошибка отправки сообщения:', error);
      return { message: null, error: 'Не удалось отправить сообщение' };
    }

    return { message: newMessage, error: null };
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    return { message: null, error: 'Произошла ошибка при отправке сообщения' };
  }
}

// Получение сообщений сессии
export async function getSessionMessages(sessionId: string): Promise<{
  messages: ChatMessage[];
  error: string | null;
}> {
  if (!isSupabaseAvailable()) {
    return { messages: [], error: 'Чат временно недоступен' };
  }

  try {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Ошибка получения сообщений:', error);
      return { messages: [], error: 'Не удалось загрузить сообщения' };
    }

    return { messages: messages || [], error: null };
  } catch (error) {
    console.error('Ошибка при получении сообщений:', error);
    return { messages: [], error: 'Произошла ошибка при загрузке сообщений' };
  }
}

// Подписка на новые сообщения в реальном времени
export function subscribeToMessages(
  sessionId: string,
  onMessage: (message: ChatMessage) => void,
  onError?: (error: any) => void
) {
  if (!isSupabaseAvailable()) {
    onError?.('Чат временно недоступен');
    return null;
  }

  const subscription = supabase
    .channel(`chat-messages-${sessionId}`)
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
        onMessage(payload.new as ChatMessage);
      }
    )
    .subscribe((status) => {
      console.log('Статус подписки на сообщения:', status);
      if (status === 'SUBSCRIBED') {
        console.log('✅ Подписка на сообщения активна');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Ошибка подписки на сообщения');
        onError?.('Ошибка подключения к чату');
      }
    });

  return subscription;
}

// Получение доступных операторов
export async function getAvailableOperators(): Promise<{
  operators: ChatOperator[];
  error: string | null;
}> {
  if (!isSupabaseAvailable()) {
    return { operators: [], error: 'Сервис временно недоступен' };
  }

  try {
    const { data: operators, error } = await supabase
      .from('chat_operators')
      .select('*')
      .eq('is_online', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Ошибка получения операторов:', error);
      return { operators: [], error: 'Не удалось загрузить операторов' };
    }

    return { operators: operators || [], error: null };
  } catch (error) {
    console.error('Ошибка при получении операторов:', error);
    return { operators: [], error: 'Произошла ошибка при загрузке операторов' };
  }
}

// Получение активных сессий чата для оператора
export async function getActiveChatSessions(): Promise<{
  sessions: ChatSession[];
  error: string | null;
}> {
  if (!isSupabaseAvailable()) {
    return { sessions: [], error: 'Сервис временно недоступен' };
  }

  try {
    const { data: sessions, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .in('status', ['waiting', 'active'])
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Ошибка получения сессий:', error);
      return { sessions: [], error: 'Не удалось загрузить сессии' };
    }

    return { sessions: sessions || [], error: null };
  } catch (error) {
    console.error('Ошибка при получении сессий:', error);
    return { sessions: [], error: 'Произошла ошибка при загрузке сессий' };
  }
}

// Отправка сообщения оператором
export async function sendOperatorMessage(
  sessionId: string,
  message: string,
  operatorId: string
): Promise<{ message: ChatMessage | null; error: string | null }> {
  if (!isSupabaseAvailable()) {
    return { message: null, error: 'Чат временно недоступен' };
  }

  try {
    const messageData = {
      session_id: sessionId,
      sender_id: operatorId,
      sender_type: 'operator' as const,
      message: message.trim(),
      message_type: 'text' as const
    };

    const { data: newMessage, error } = await supabase
      .from('chat_messages')
      .insert([messageData])
      .select()
      .single();

    if (error) {
      console.error('Ошибка отправки сообщения оператором:', error);
      return { message: null, error: 'Не удалось отправить сообщение' };
    }

    return { message: newMessage, error: null };
  } catch (error) {
    console.error('Ошибка при отправке сообщения оператором:', error);
    return { message: null, error: 'Произошла ошибка при отправке сообщения' };
  }
}

// Назначение оператора на сессию
export async function assignOperatorToSession(
  sessionId: string,
  operatorId: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseAvailable()) {
    return { success: false, error: 'Сервис временно недоступен' };
  }

  try {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ 
        operator_id: operatorId,
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Ошибка назначения оператора:', error);
      return { success: false, error: 'Не удалось назначить оператора' };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Ошибка при назначении оператора:', error);
    return { success: false, error: 'Произошла ошибка при назначении оператора' };
  }
}

// Закрытие сессии чата
export async function closeChatSession(sessionId: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  if (!isSupabaseAvailable()) {
    return { success: false, error: 'Сервис временно недоступен' };
  }

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
      console.error('Ошибка закрытия сессии:', error);
      return { success: false, error: 'Не удалось закрыть сессию' };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Ошибка при закрытии сессии:', error);
    return { success: false, error: 'Произошла ошибка при закрытии сессии' };
  }
}