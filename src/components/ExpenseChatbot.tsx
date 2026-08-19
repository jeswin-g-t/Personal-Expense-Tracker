import React, { FormEvent, useState } from 'react';
import { Bot, Loader2, MessageCircle, Send, X } from 'lucide-react';
import { Expense } from '../types/expense';

interface ExpenseChatbotProps {
  expenses: Expense[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  answer?: string;
  error?: string;
}

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

export const ExpenseChatbot: React.FC<ExpenseChatbotProps> = ({ expenses }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! Ask me anything about your expenses.',
    },
  ]);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: 'user', content: trimmedMessage },
    ]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedMessage,
          expenses,
        }),
      });
      const data = (await response.json()) as ChatResponse;

      if (!response.ok) {
        throw new Error(data.error || 'The assistant could not respond.');
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', content: data.answer || 'I could not find an answer.' },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'The assistant could not respond right now.';

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', content: errorMessage },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen && (
        <section className="mb-4 flex h-[min(600px,calc(100vh-110px))] w-[min(380px,calc(100vw-40px))] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <header className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <h2 className="font-semibold">Expense Assistant</h2>
                <p className="text-xs text-blue-100">Your expense data is available for this chat</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-blue-100 transition-colors hover:bg-blue-700 hover:text-white"
              aria-label="Close expense assistant"
            >
              <X size={18} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4" aria-live="polite">
            {messages.map((chatMessage, index) => (
              <div
                key={`${chatMessage.role}-${index}`}
                className={`flex ${chatMessage.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${
                    chatMessage.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  {chatMessage.content}
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="animate-spin" size={16} />
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-gray-200 bg-white p-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about your expenses..."
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={isLoading}
              aria-label="Ask the expense assistant"
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="rounded-lg bg-blue-600 px-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="ml-auto flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 font-medium text-white shadow-lg transition-colors hover:bg-blue-700"
        aria-label={isOpen ? 'Close expense assistant' : 'Open expense assistant'}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        <span>{isOpen ? 'Close' : 'Ask AI'}</span>
      </button>
    </div>
  );
};
