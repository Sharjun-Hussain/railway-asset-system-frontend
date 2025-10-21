// app/(dashboard)/components/ChatInterface.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

// Shortcut prompts
const shortcutPrompts = [
  "Where is asset AS-1024?",
  "Show all assets in Maradana",
  "What was the last movement for 'Signal Light Set'?",
  "List users in the Batticaloa branch",
];

export function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      content:
        "Welcome to the SLR Asset Assistant. How can I help you today? You can ask about asset locations, warehouse inventory, or user roles.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // ... (Dummy API call logic remains the same) ...
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const botResponse = {
      id: Date.now() + 1,
      role: "bot",
      content: `Query received for: "${userMessage.content}". I am processing this... \n\n(This is a placeholder. Connect me to your RAG endpoint.)`,
    };
    setMessages((prev) => [...prev, botResponse]);
    setIsLoading(false);
  };

  const handleShortcutClick = (prompt) => {
    setInput(prompt);
  };

  return (
    // Removed max-h-[700px] and changed to h-[80vh] for a taller, simpler height
    <Card className="flex flex-col h-[80vh]">
      <CardHeader className="border-b">
        <CardTitle>Asset Query Assistant</CardTitle>
        <CardDescription>
          Ask about assets, inventory, movements, and users.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-4",
                  message.role === "user" ? "justify-end" : ""
                )}
              >
                {message.role === "bot" && (
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback>
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-foreground rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex-col items-start gap-4 border-t pt-6">
        <div className="flex flex-wrap gap-2">
          {shortcutPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              onClick={() => handleShortcutClick(prompt)}
              disabled={isLoading}
            >
              {prompt}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex w-full items-start gap-2">
          <Textarea
            placeholder="e.g., 'List all locomotive engines in the Maradana warehouse...'"
            value={input}
            onChange={(e) => setInput(e.T.value)}
            disabled={isLoading}
            className="flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <SendHorizontal className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
