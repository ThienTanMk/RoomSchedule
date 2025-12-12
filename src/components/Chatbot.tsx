'use client';

import { useState, useEffect, useRef } from 'react';
import { useCurrentUser } from '@/hook/useAuth';
import { 
  useChatbotHistory, 
  useAskChatbot, 
  useClearChatHistory,
  useChatbotSSE 
} from '@/hook/useChatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, Sparkles, Send, Trash2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  text: string;
  isUser: boolean;
}

export default function Chatbot() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { data: user } = useCurrentUser();
  const keycloakId = user?.keycloakId;

  const { data: history } = useChatbotHistory(keycloakId);
  const askMutation = useAskChatbot();
  const clearMutation = useClearChatHistory();

  const historyMessages: Message[] = history?.data
    ? history.data.map((item) => ({
        text: item.message,
        isUser: item.role === 'USER',
      }))
    : [];

  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const messages = [...historyMessages, ...newMessages];

  useChatbotSSE(keycloakId || '', (data) => {
    setNewMessages((prev) => [...prev, { text: data, isUser: false }]);
    setIsTyping(false);
  });

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!currentMessage.trim() || !keycloakId || isTyping) return;

    setIsTyping(true);
    setNewMessages((prev) => [...prev, { text: currentMessage, isUser: true }]);
    
    askMutation.mutate(
      { message: currentMessage, keycloakId },
      { onError: () => setIsTyping(false) }
    );
    
    setCurrentMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (!keycloakId) return;
    clearMutation.mutate(keycloakId, {
      onSuccess: () => setNewMessages([]),
    });
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-md opacity-40" />
              <div className="relative p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                AI Assistant
              </h2>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Sẵn sàng hỗ trợ
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="hover:bg-red-50 hover:text-red-600 transition-colors rounded-xl"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-2xl opacity-20" />
                <div className="relative p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl">
                  <Bot className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Xin chào! 👋</h3>
              <p className="text-slate-500 text-center max-w-md">
                Tôi là trợ lý AI của bạn. Hãy đặt câu hỏi hoặc yêu cầu tôi giúp đỡ bất cứ điều gì!
              </p>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={message.isUser ? 'flex justify-end' : 'flex justify-start'}
              >
                <div className={`flex items-start gap-3 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                    message.isUser 
                      ? 'bg-gradient-to-br from-slate-700 to-slate-900' 
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}>
                    {message.isUser ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-5 py-3 shadow-sm ${
                    message.isUser
                      ? 'bg-gradient-to-br from-slate-700 to-slate-900 text-white'
                      : 'bg-white border border-slate-200/60 text-slate-800'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-slate-200/60 rounded-2xl px-5 py-4 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative group">
              <Input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn của bạn..."
                disabled={isTyping}
                className="w-full h-14 px-5 text-sm bg-slate-50 border-slate-200 rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!currentMessage.trim() || isTyping}
              className="h-14 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 text-center mt-3">
            AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
          </p>
        </div>
      </div>
    </div>
  );
}