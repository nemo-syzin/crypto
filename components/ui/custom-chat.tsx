"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  ExternalLink
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'operator';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered';
}

interface CustomChatProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

export function CustomChat({ isOpen, onClose, onMinimize, isMinimized }: CustomChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [operatorTyping, setOperatorTyping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Автоматическая прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Симуляция подключения к чату
  useEffect(() => {
    if (isOpen && !isConnected) {
      const timer = setTimeout(() => {
        setIsConnected(true);
        // Приветственное сообщение
        const welcomeMessage: Message = {
          id: 'welcome',
          text: 'Добро пожаловать в службу поддержки KenigSwap! Меня зовут Анна, я помогу вам с любыми вопросами. Как дела?',
          sender: 'operator',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isConnected]);

  // Симуляция печатания оператора
  const simulateOperatorTyping = () => {
    setOperatorTyping(true);
    setTimeout(() => {
      setOperatorTyping(false);
      // Добавляем ответ оператора
      const responses = [
        'Спасибо за ваш вопрос! Я передам его нашему специалисту.',
        'Понял вас. Сейчас проверю информацию и отвечу.',
        'Отличный вопрос! Позвольте мне найти для вас актуальную информацию.',
        'Я свяжусь с техническим отделом и верну вам ответ в течение нескольких минут.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const operatorMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: 'operator',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, operatorMessage]);
    }, 2000 + Math.random() * 2000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setChatStarted(true);

    // Симуляция отправки и ответа оператора
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
      
      // Симулируем ответ оператора
      simulateOperatorTyping();
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
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
                  {isConnected ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Анна онлайн</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span>Подключение...</span>
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
                onClick={onClose}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {!isConnected ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001D8D] mx-auto mb-4"></div>
                      <p className="text-[#001D8D]/70">Подключение к оператору...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`p-3 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-[#001D8D] text-white'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {message.sender === 'user' && message.status && (
                              <div className="flex items-center gap-1">
                                {message.status === 'delivered' && <CheckCircle className="h-3 w-3 text-green-500" />}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' ? 'order-1 ml-2' : 'order-2 mr-2'
                        }`}>
                          {message.sender === 'user' ? (
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
                      Подключение к оператору...
                    </div>
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#001D8D]"></div>
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Компонент кнопки для открытия чата
export function ChatButton({ onClick, isLoading }: { onClick: () => void; isLoading?: boolean }) {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-[#001D8D] to-blue-600 text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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