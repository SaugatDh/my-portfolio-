import React, { useState, useRef, useEffect } from 'react';
import { createChatSession, sendMessageToGemini, hasApiKey, getFallbackResponse } from '../services/geminiService';
import { MessageRole, ChatMessage } from '../types';
import { GenerateContentResponse } from '@google/genai';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: MessageRole.MODEL, text: "Hi! I'm Saugat's AI assistant. Ask me anything about his work, skills, or projects." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasKey = hasApiKey();

  useEffect(() => {
    if (hasKey) {
      createChatSession();
    }
  }, [hasKey]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = { role: MessageRole.USER, text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (hasKey) {
        const stream = await sendMessageToGemini(userMessage.text);
        
        if (stream) {
          let fullResponse = "";
          setMessages(prev => [...prev, { role: MessageRole.MODEL, text: "", isLoading: true }]);

          for await (const chunk of stream) {
            const c = chunk as GenerateContentResponse;
            if (c.text) {
              fullResponse += c.text;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg.role === MessageRole.MODEL) {
                    lastMsg.text = fullResponse;
                    lastMsg.isLoading = false;
                }
                return newMessages;
              });
            }
          }
        } else {
          setMessages(prev => [...prev, { role: MessageRole.MODEL, text: "Sorry, I'm having trouble connecting right now." }]);
        }
      } else {
        const fallbackResponse = await getFallbackResponse(userMessage.text);
        setMessages(prev => [...prev, { role: MessageRole.MODEL, text: fallbackResponse }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: MessageRole.MODEL, text: "Unable to connect. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-surface border border-border rounded-lg shadow-xl overflow-hidden flex flex-col h-[500px] transition-all duration-300 ease-out animate-fade-in-up">
          <div className="bg-foreground p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-background font-mono text-sm font-bold">AI Assistant</h3>
              <span className={`w-2 h-2 rounded-full ${hasKey ? 'bg-green-400' : 'bg-red-400'}`} title={hasKey ? 'Online' : 'Offline - Using cached responses'}></span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-background/50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-lg p-3 text-sm ${
                    msg.role === MessageRole.USER 
                      ? 'bg-foreground text-background' 
                      : 'bg-surface border border-border text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && !messages[messages.length - 1]?.isLoading && (
               <div className="flex justify-start">
                  <div className="bg-surface border border-border rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-surface border-t border-border">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Saugat..."
                className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-colors text-foreground"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="bg-foreground text-background p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 bg-foreground text-background rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-surface"></span>
        {isOpen ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>
    </div>
  );
};

export default AIChatbot;