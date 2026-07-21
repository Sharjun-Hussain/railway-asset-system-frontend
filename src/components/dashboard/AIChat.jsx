"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
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
import { Skeleton } from "@/components/ui/skeleton";
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
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const res = await apiClient.get("/rag/history");
        const history = res.data?.data || [];
        if (history.length > 0) {
          const formattedHistory = history.map((msg, idx) => ({
            id: msg._id || "hist-" + idx,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages([...INITIAL_MESSAGES, ...formattedHistory]);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    loadHistory();
  }, []);

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
    <Card className="flex flex-col h-[calc(100vh-180px)] min-h-[500px] border-none shadow-xl rounded-2xl overflow-hidden bg-card/80 backdrop-blur-md">
      <CardHeader className="p-4 border-b border-border/50 shrink-0 bg-secondary/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <CardTitle className="text-lg font-bold">
              Railway AI Assistant
            </CardTitle>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Intelligent asset management and support
            </p>
          </div>
        </div>
      </CardHeader>


      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
        {/* Messages Container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-tiny"
        >
          {isHistoryLoading ? (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                <Skeleton className="h-16 w-3/4 rounded-2xl rounded-tl-none" />
              </div>
              <div className="flex gap-4 flex-row-reverse">
                <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                <Skeleton className="h-12 w-1/2 rounded-2xl rounded-tr-none" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                <Skeleton className="h-24 w-2/3 rounded-2xl rounded-tl-none" />
              </div>
            </div>
          ) : (
            messages.map((msg) => (
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
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ol: ({ children }) => <ol className="list-decimal list-outside pl-4 space-y-3 my-1">{children}</ol>,
                        ul: ({ children }) => <ul className="list-disc list-outside pl-4 space-y-1 my-1">{children}</ul>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        strong: ({ children }) => <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>,
                        h3: ({ children }) => <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-3 mb-1">{children}</h3>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
                <span className="text-[10px] font-bold text-muted-foreground/60 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))
          )}
        </div>

        {/* Quick Actions & Input Area */}
        <div className="p-4 border-t border-border/50 bg-secondary/5">

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
