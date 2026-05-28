"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  AlertCircle, 
  Search, 
  History,
  Terminal,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/lib/api";

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "assistant",
    content: "Welcome to the SL Railway Command Center. I'm your AI asset specialist. How can I assist you with your operations today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export function AIChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInput("");

    // Add loading message first
    const loadingMessageId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: loadingMessageId,
      role: "assistant",
      content: "Thinking...",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    const fetchAnswer = async () => {
      try {
        const response = await apiClient.post("/rag/query", { prompt: input });
        const answer = response.data.data.answer;

        setMessages(prev => prev.map(msg => 
          msg.id === loadingMessageId 
            ? { ...msg, content: answer || "I'm sorry, I couldn't process your request." } 
            : msg
        ));
      } catch (error) {
        console.error("Chat API Error:", error);
        setMessages(prev => prev.map(msg => 
          msg.id === loadingMessageId 
            ? { ...msg, content: "Sorry, I encountered an error while trying to connect to the AI server." } 
            : msg
        ));
      }
    };

    fetchAnswer();
  };

  const QUICK_ACTIONS = [
    // { label: "Status Report", icon: Terminal },
    // { label: "Alerts Log", icon: AlertCircle },
    // { label: "Find Asset", icon: Search },
    // { label: "System Health", icon: Cpu }
  ];

  return (
    <Card className="flex flex-col h-[600px] border-none shadow-xl rounded-2xl overflow-hidden bg-card/80 backdrop-blur-md">
      <CardHeader className="border-b border-border/50 bg-secondary/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <Bot size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight">Railway AI Assistant</CardTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                {/* <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-muted-foreground/70">Neural Engine Online</span> */}
              </div>
            </div>
          </div>
         
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
        {/* Messages Container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-tiny"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'assistant' 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>
              
              <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`py-2.5 px-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
                  msg.role === 'assistant'
                    ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-tl-none border border-border/50'
                    : 'bg-primary text-white rounded-tr-none font-medium'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] font-bold text-muted-foreground/60 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions & Input Area */}
        <div className="p-4 border-t border-border/50 bg-secondary/5 space-y-3">
          <div className="flex gap-2 p-1 overflow-x-auto scrollbar-tiny">
            {QUICK_ACTIONS.map((action) => (
              <Button 
                key={action.label}
                variant="outline" 
                size="sm" 
                className="h-8 rounded-lg bg-white/80 dark:bg-slate-950 border-border font-semibold text-xs whitespace-nowrap hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <action.icon size={12} className="mr-1.5" />
                {action.label}
              </Button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="relative group">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about assets, maintenance or inventory..."
              className="h-10 pl-4 pr-10 rounded-xl border-border bg-white dark:bg-slate-950 shadow-inner focus-visible:ring-primary focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 transition-all font-medium text-sm"
            />
            <Button 
              type="submit"
              disabled={!input.trim()}
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 rounded-lg bg-primary hover:bg-primary/95 shadow-lg shadow-primary/20 transition-transform active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              <Send size={14} />
            </Button>
          </form>
          
         
        </div>
      </CardContent>
    </Card>
  );
}
