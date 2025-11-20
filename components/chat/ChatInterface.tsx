'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm here to help you set up a scraping task. What would you like to scrape today?\n\nI can help you with:\n• Website content\n• Facebook posts\n• Facebook groups\n• Facebook comments\n• AI-powered web research (RAG)",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStartingScrape, setIsStartingScrape] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startScraping = async (parameters: any) => {
    setIsStartingScrape(true);
    const loadingToast = toast.loading('Starting scraping session...', {
      description: 'Please wait while we initialize your scraping task.',
    });

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parameters }),
      });

      const data = await response.json();

      if (data.success) {
        toast.dismiss(loadingToast);
        toast.success('Scraping session started!', {
          description: data.message || 'Your scraping task is now running.',
          duration: 3000,
        });

        // Show success message
        const successMessage: ChatMessage = {
          role: 'assistant',
          content: `🚀 ${data.message}\n\nRedirecting to session page...`,
        };
        setMessages((prev) => [...prev, successMessage]);

        // Redirect to session page
        setTimeout(() => {
          window.location.href = `/sessions/${data.sessionId}`;
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to start scraping session');
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorMsg = error.message || 'An unexpected error occurred';
      toast.error('Failed to start scraping', {
        description: errorMsg,
        duration: 5000,
        action: {
          label: 'Retry',
          onClick: () => startScraping(parameters),
        },
      });

      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `❌ Failed to start scraping: ${errorMsg}\n\nPlease check your parameters and try again.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsStartingScrape(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Server error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Add AI response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Check if parameters are ready
      if (data.ready && data.parameters) {
        // Start scraping
        await startScraping(data.parameters);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMsg =
        error.message ||
        'Unable to connect to the server. Please check your connection and try again.';

      toast.error('Failed to send message', {
        description: errorMsg,
        duration: 5000,
      });

      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `❌ ${errorMsg}\n\nPlease try again or check your connection.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Messages Container */}
        <div className="h-[500px] overflow-y-auto pr-4">
          <MessageList messages={messages} />

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 mt-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <div className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              </div>
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading || isStartingScrape}
        />
      </div>
    </Card>
  );
}
