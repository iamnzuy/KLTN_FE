'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircleIcon, SendHorizontal, Loader2, Bot } from 'lucide-react';
import TextareaAutoResize from 'react-textarea-autosize';
import { useSession } from 'next-auth/react';
import { sendChatMessage } from '@/components/chatbot/services/chatbot-api';
import { ChatMessage, TopProduct } from '@/components/chatbot/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatbotPanelProps {
  onProductsUpdate: (products: TopProduct[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

export function ChatbotPanel({ onProductsUpdate, onLoadingChange }: ChatbotPanelProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const userId = session?.user?.id || session?.user?.email || 'test_user_001';
      const response = await sendChatMessage({
        message: userMessage.content,
        user_id: userId,
        k: 20,
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        products: response.top_products,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      if (response.top_products && response.top_products.length > 0) {
        onProductsUpdate(response.top_products);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-lg border-2">
      {/* Header */}
      <div className="h-16 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-between px-6 flex-shrink-0 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-base">AI Tư vấn sản phẩm</h2>
            <p className="text-white/80 text-xs">Hỏi bất cứ điều gì về sản phẩm</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-background to-muted/20 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-muted-foreground py-12"
          >
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircleIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">Chào bạn!</p>
            <p className="text-xs">Tôi có thể giúp bạn tìm sản phẩm phù hợp</p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md border border-border/50'
                )}
              >
                <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-muted text-foreground rounded-2xl rounded-bl-md px-4 py-3 border border-border/50">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm">Đang xử lý...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-2 px-4 py-4 border-t border-border bg-background flex-shrink-0 rounded-b-xl">
        <div className="flex-1 relative">
          <TextareaAutoResize
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="w-full min-h-[2.75rem] max-h-32 p-3 pr-12 rounded-xl resize-none text-sm bg-muted/50 border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground"
            placeholder="Nhập câu hỏi của bạn..."
            rows={1}
          />
        </div>
        <motion.button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-11 w-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-md disabled:shadow-none"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <SendHorizontal className="w-5 h-5" />
          )}
        </motion.button>
      </div>
    </Card>
  );
}

