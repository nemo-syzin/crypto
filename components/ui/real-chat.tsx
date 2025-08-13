"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  X, 
  Send, 
  User, 
  Bot, 
  Clock,
  CheckCircle,
  Minimize2,
  Maximize2,
  Phone,
  Mail,
  ExternalLink,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  createChatSession,
  sendMessage,
  getSessionMessages,
  subscribeToMessages,
  closeChatSession,
  type ChatSession,
  type ChatMessage
} from '@/lib/chat';

interface RealChatProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

export function RealChat({ isOpen, onClose, onMinimize, isMinimized }: RealChatProps) {
  const { toast } = useToast();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [operatorTyping, setOperatorTyping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [showUserForm, setShowUserForm] = useState(true);
  const [connectionTimeoutId, setConnectionTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<any>(null);

  // Автоматическая прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Очистка таймаута при размонтировании или успешном подключении
  useEffect(() => {
    return () => {
      if (connectionTimeoutId) clearTimeout(connectionTimeoutId);
    };
  }, [connectionTimeoutId]);

  // Очистка при закрытии
  useEffect(() => {
    if (!isOpen) {
      // Отписываемся от обновлений
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    }
  }, [isOpen]);

  // Начало чата
  const startChat = async () => {
    if (!userInfo.name.trim() || !userInfo.email.trim()) {
      toast({
        title: "Заполните данные",
        description: "Пожалуйста, укажите ваше имя и email",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    // Устанавливаем таймаут для подключения
    setConnectionTimeoutId(setTimeout(() => {
      setIsConnecting(false);
      toast({
        title: "Ошибка подключения",
        description: "Время ожидания подключения истекло. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
      handleCloseChat(); // Закрываем чат, чтобы пользователь мог попробовать снова
    }, 15000)); // 15 секунд таймаут
    
    try {
      const { session: newSession, error } = await createChatSession(
        userInfo.name,
        userInfo.email,
        'Здравствуйте! У меня есть вопрос по обмену криптовалют.'
      );

      if (error || !newSession) {
        throw new Error(error || 'Не удалось создать сессию чата');
      }

      setSession(newSession);
      setShowUserForm(false);
      setIsConnected(true);
      setChatStarted(true);

      // Загружаем существующие сообщения
      // Это должно включать начальное сообщение, отправленное пользователем
      // Если оно не появляется, проблема может быть в sendMessage или getSessionMessages в lib/chat.ts
      // (которые не могут быть изменены в этом запросе)
      const { messages: existingMessages } = await getSessionMessages(newSession.id);
      setMessages(existingMessages);

      // Подписываемся на новые сообщения
      subscriptionRef.current = subscribeToMessages(
        newSession.id,
        (message) => {
          setMessages(prev => [...prev, message]);
          
          // Если сообщение от оператора, убираем индикатор печатания
          if (message.sender_type === 'operator') {
            setOperatorTyping(false);
          }
        },
        (error) => {
          console.error('Ошибка подписки на сообщения:', error);
          toast({
            title: "Ошибка подключения",
            description: "Проблема с подключением к чату",
            variant: "destructive",
          });
        }
      );

      // Симулируем подключение оператора через несколько секунд
      setTimeout(() => {
        const welcomeMessage: ChatMessage = {
          id: `welcome-${Date.now()}`,
          session_id: newSession.id,
          sender_id: null,
          sender_type: 'operator',
          message: `Здравствуйте, ${userInfo.name}! Меня зовут Анна, я оператор поддержки KenigSwap. Как дела? Чем могу помочь?`,
          message_type: 'text',
          created_at: new Date().toISOString(),
          read_at: null,
          metadata: {}
        };
        
        setMessages(prev => [...prev, welcomeMessage]);
      }, 2000);

      toast({
        title: "Чат подключен",
        description: "Вы подключены к службе поддержки KenigSwap",
      });

      // Очищаем таймаут, так как подключение успешно
      if (connectionTimeoutId) clearTimeout(connectionTimeoutId);

    } catch (error) {
      console.error('Ошибка запуска чата:', error);
      toast({
        title: "Ошибка подключения",
        description: error instanceof Error ? error.message : "Не удалось подключиться к чату",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
      if (connectionTimeoutId) clearTimeout(connectionTimeoutId); // Гарантируем очистку таймаута
    }
  };

  // Отправка сообщения
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !session) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const { message: sentMessage, error } = await sendMessage(
        session.id,
        messageText,
        'user'
      );

      if (error) {
        throw new Error(error);
      }

      // Сообщение будет добавлено через подписку на реальном времени
      
      // Симулируем ответ оператора
      setOperatorTyping(true);
      setTimeout(async () => {
        const responses = [
          'Спасибо за ваш вопрос! Сейчас проверю информацию.',
          'Понял вас. Позвольте мне найти решение.',
          'Отличный вопрос! Сейчас свяжусь с техническим отделом.',
          'Я передам ваш запрос специалисту и верну ответ в течение нескольких минут.'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        await sendMessage(session.id, randomResponse, 'operator');
        setOperatorTyping(false);
      }, 1500 + Math.random() * 2000);

    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleCloseChat = async () => {
    if (session) {
      await closeChatSession(session.id);
    }
    
    // Отписываемся от обновлений
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    
    // Сбрасываем состояние
    setSession(null);
    setMessages([]);
    setIsConnected(false);
    setChatStarted(false);
    setShowUserForm(true);
    setUserInfo({ name: '', email: '' });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={handleCloseChat}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: isMinimized ? 0.3 : 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className={`bg-white rounded-xl shadow-2xl ${
            isMinimized ? 'w-80 h-20' : 'w-full max-w-md h-[600px]'
          } flex flex-col overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#001D8D] to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                {isConnected && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Поддержка KenigSwap</h3>
                <div className="text-sm text-white/80 flex items-center gap-2">
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Подключение...</span>
                    </>
                  ) : isConnected ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Анна онлайн</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>Не подключен</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {onMinimize && (
                <button
                  onClick={onMinimize}
                  className="text-white/80 hover:text-white p-1 rounded"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
              )}
              <button
                onClick={handleCloseChat}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* User Info Form */}
              {showUserForm && (
                <div className="p-6 bg-gray-50">
                  <h4 className="font-semibold text-[#001D8D] mb-4">Начать чат</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[#001D8D] mb-1 block">
                        Ваше имя
                      </label>
                      <Input
                        value={userInfo.name}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Введите ваше имя"
                        className="border-[#001D8D]/20 focus:border-[#001D8D]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#001D8D] mb-1 block">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="border-[#001D8D]/20 focus:border-[#001D8D]"
                      />
                    </div>
                    <Button
                      onClick={startChat}
                      disabled={isConnecting}
                      className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 text-white hover:opacity-90"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Подключение...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Начать чат
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              {!showUserForm && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 && !isConnecting ? ( // Показываем это сообщение только если нет сообщений и не идет активное подключение
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 text-[#001D8D]/40 mx-auto mb-4" />
                          <p className="text-[#001D8D]/70">Ожидание сообщений...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] ${message.sender_type === 'user' ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`p-3 rounded-lg ${
                                  message.sender_type === 'user'
                                    ? 'bg-[#001D8D] text-white'
                                    : 'bg-white border border-gray-200'
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                              </div>
                              <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                                message.sender_type === 'user' ? 'justify-end' : 'justify-start'
                              }`}>
                                <span>{formatTime(message.created_at)}</span>
                                {message.sender_type === 'user' && (
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                )}
                              </div>
                            </div>
                            
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.sender_type === 'user' ? 'order-1 ml-2' : 'order-2 mr-2'
                            }`}>
                              {message.sender_type === 'user' ? (
                                <div className="w-8 h-8 bg-[#001D8D] rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-white" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Bot className="h-4 w-4 text-blue-600" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Typing Indicator */}
                        {operatorTyping && (
                          <div className="flex justify-start">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Bot className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="bg-white border border-gray-200 p-3 rounded-lg">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Quick Actions */}
                  {isConnected && !chatStarted && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="text-sm text-[#001D8D]/70 mb-3">Быстрые вопросы:</div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Как совершить обмен?',
                          'Какие комиссии?',
                          'Время обработки?',
                          'Проблема с транзакцией'
                        ].map((quickQuestion) => (
                          <button
                            key={quickQuestion}
                            onClick={() => {
                              setNewMessage(quickQuestion);
                              setTimeout(handleSendMessage, 100);
                            }}
                            className="text-xs px-3 py-2 bg-[#001D8D]/10 text-[#001D8D] rounded-full hover:bg-[#001D8D]/20 transition-colors"
                          >
                            {quickQuestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    {isConnected ? (
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Введите ваше сообщение..."
                            className="border-[#001D8D]/20 focus:border-[#001D8D]"
                            disabled={operatorTyping}
                          />
                        </div>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || operatorTyping}
                          className="bg-[#001D8D] hover:bg-[#001D8D]/90 text-white p-3"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-sm text-[#001D8D]/70 mb-3">
                          Заполните данные выше для начала чата
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Alternative Contact Methods */}
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="text-xs text-[#001D8D]/70 mb-2">Другие способы связи:</div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 text-xs px-2 py-1 bg-white border border-gray-200 rounded text-[#001D8D] hover:bg-gray-50">
                        <Mail className="h-3 w-3" />
                        Email
                      </button>
                      <button className="flex items-center gap-1 text-xs px-2 py-1 bg-white border border-gray-200 rounded text-[#001D8D] hover:bg-gray-50">
                        <Phone className="h-3 w-3" />
                        Телефон
                      </button>
                      <button className="flex items-center gap-1 text-xs px-2 py-1 bg-white border border-gray-200 rounded text-[#001D8D] hover:bg-gray-50">
                        <ExternalLink className="h-3 w-3" />
                        Telegram
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Компонент кнопки для открытия чата
export function RealChatButton({ onClick, isLoading }: { onClick: () => void; isLoading?: boolean }) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Загрузка чата...
        </>
      ) : (
        <>
          <MessageCircle className="h-4 w-4 mr-2" />
          Открыть чат
        </>
      )}
    </Button>
  );
}