'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Sparkles, RotateCcw } from 'lucide-react';

interface ChatWithDataInterfaceProps {
  sessionId: string;
  resultCount: number;
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 bg-muted rounded-lg p-3 max-w-[80%]">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export default function ChatWithDataInterface({
  sessionId,
  resultCount,
}: ChatWithDataInterfaceProps) {
  const STORAGE_KEY = `chat-history-${sessionId}`;

  // Initialize messages from localStorage or with default
  const getInitialMessages = (): ChatMessage[] => {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // If parsing fails, return default
      }
    }

    // Default initial message
    return [
      {
        role: 'assistant',
        content: `Hi! I'm here to help you analyze your scraped data (${resultCount} items).\n\nYou can ask me to:\n• Summarize the data\n• Find patterns and insights\n• Analyze sentiment\n• Categorize content\n• Answer specific questions about the data\n\nWhat would you like to know?`,
      },
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, STORAGE_KEY]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call Chat Data API
      const response = await fetch('/api/chat-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze data');
      }

      // Add AI response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMsg = error.message || 'An unexpected error occurred';
      toast.error('Failed to get response', {
        description: errorMsg,
        duration: 5000,
      });

      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error while analyzing the data: ${errorMsg}\n\nPlease try again or rephrase your question.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const initialMessage: ChatMessage = {
      role: 'assistant',
      content: `Hi! I'm here to help you analyze your scraped data (${resultCount} items).\n\nYou can ask me to:\n• Summarize the data\n• Find patterns and insights\n• Analyze sentiment\n• Categorize content\n• Answer specific questions about the data\n\nWhat would you like to know?`,
    };
    setMessages([initialMessage]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Chat cleared', {
      description: 'Conversation history has been reset.',
    });
  };

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Chat with Data</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            disabled={isLoading || messages.length <= 1}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Ask me anything about your {resultCount.toLocaleString()} scraped items
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </Card>
  );
}
