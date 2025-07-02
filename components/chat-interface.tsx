'use client';

import { useApp } from '@/app/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from 'ai/react';
import { Send, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MarkdownRenderer } from './markdown-renderer';

const FOLLOW_UP_SUGGESTIONS = [
  'Can you explain this in more detail?',
  'What are the alternatives?',
  'How can I implement this?',
  'What are the best practices?',
];

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/chat',
    });
  const { sidebarOpen, setCommandPaletteOpen } = useApp();
  const [followUps, setFollowUps] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      // Generate contextual follow-ups based on the last message
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        setFollowUps(FOLLOW_UP_SUGGESTIONS);
      }
    }
  }, [messages, isLoading]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFollowUp = (suggestion: string) => {
    handleInputChange({ target: { value: suggestion } } as any);
  };

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <Sparkles className="h-12 w-12 mx-auto text-blue-500" />
            <h1 className="text-2xl font-bold">Welcome to AI Chat</h1>
            <p className="text-gray-400">
              Start a conversation or use keyboard shortcuts to navigate
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">⌘K</kbd>
              <span>Open Command Palette</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">⌘B</kbd>
              <span>Toggle Sidebar</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">
                ⌘ Enter
              </kbd>
              <span>New Chat</span>
            </div>
          </div>

          <Button
            onClick={() => setCommandPaletteOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                {message.role === 'user' ? (
                  <p>{message.content}</p>
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-lg p-4 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Follow-up Suggestions */}
      {followUps.length > 0 && !isLoading && (
        <div className="px-6 py-3 border-t border-gray-700">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-400 mb-2">Suggested follow-ups:</p>
            <div className="flex flex-wrap gap-2">
              {followUps.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleFollowUp(suggestion)}
                  className="text-xs border-gray-600 hover:bg-gray-700"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 border-t border-gray-700">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message... (⌘K for command palette)"
              className="flex-1 bg-gray-800 border-gray-600 focus:border-blue-500"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
