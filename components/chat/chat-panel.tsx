"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, ChevronUp, ChevronDown, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChatStore } from "@/lib/chat-store";
import { UsernameModal } from "@/components/chat/username-modal";
import { cn } from "@/lib/utils";
import Dexie from "dexie";

export function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const { username, messages, addMessage, activeUsers, setUsername, setActiveUsers, addActiveUser, removeActiveUser, setMessages } =
    useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Load initial messages from IndexedDB
  useEffect(() => {
    const loadMessages = async () => {
      const db = new Dexie("RadioXChatDB");
      await db.open();
      const allMessages = await db.table("messages").orderBy("timestamp").toArray();
      setMessages(allMessages);
    };
    loadMessages();
  }, [setMessages]);

  // Initialize SSE
  useEffect(() => {
    const SSE_URL = "/api/chat";
    eventSourceRef.current = new EventSource(SSE_URL);

    eventSourceRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          addMessage({
            id: data.id,
            username: data.username,
            text: data.text,
            timestamp: data.timestamp,
            color: data.color,
          });
        } else if (data.type === "user-joined") {
          addActiveUser(data.username, data.color);
        } else if (data.type === "user-left") {
          removeActiveUser(data.username);
        } else if (data.type === "users") {
          setActiveUsers(data.users);
        }
      } catch (err) {
        console.error("Error processing SSE message:", err);
      }
    };

    eventSourceRef.current.onerror = () => {
      console.error("SSE error");
    };

    return () => {
      eventSourceRef.current?.close();
    };
  }, [addMessage, addActiveUser, removeActiveUser, setActiveUsers]);

  // Announce presence
  useEffect(() => {
    if (username) {
      const color = generateColorFromUsername(username);
      fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "user-joined", username, color }),
      });
      addActiveUser(username, color);

      return () => {
        fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "user-left", username }),
        });
      };
    }
  }, [username, addActiveUser]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (isOpen && username) {
      inputRef.current?.focus();
    }
  }, [isOpen, username]);

  // Open username modal
  useEffect(() => {
    if (isOpen && !username) {
      setIsUsernameModalOpen(true);
    }
  }, [isOpen, username]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !username) return;

    const newMessage = {
      id: Date.now().toString() + "-" + Math.random().toString(36).substr(2, 9),
      username,
      text: message.trim(),
      timestamp: new Date().toISOString(),
      color: generateColorFromUsername(username),
    };

    await addMessage(newMessage);
    await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "message", ...newMessage }),
    });

    setMessage("");
  };

  const handleUsernameSet = (name: string) => {
    setUsername(name);
    setIsUsernameModalOpen(false);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !username) {
      setIsUsernameModalOpen(true);
    }
  };

  function generateColorFromUsername(username: string): string {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "text-blue-400",
      "text-green-400",
      "text-yellow-400",
      "text-purple-400",
      "text-pink-400",
      "text-indigo-400",
      "text-red-400",
      "text-orange-400",
      "text-teal-400",
      "text-cyan-400",
    ];
    return colors[Math.abs(hash) % colors.length];
  }

  return (
    <>
      <div
        className={cn(
          "fixed bottom-16 right-4 z-40 w-80 sm:w-96 transition-all duration-300 ease-in-out",
          isOpen ? "translate-y-0" : "translate-y-full",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="glass-card rounded-t-xl overflow-hidden border-b-0 flex flex-col h-96">
          <div className="flex items-center justify-between p-3 border-b border-slate-800/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <h3 className="font-medium">Global Chat</h3>
              <Badge variant="outline" className="text-xs bg-emerald-900/30 text-emerald-300 border-emerald-500/30">
                <Users className="h-3 w-3 mr-1" />
                {Object.keys(activeUsers).length}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <ScrollArea className="flex-1 p-3">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-center p-4">
                <div>
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Be the first to say hello!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-800 text-xs">
                        {msg.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn("font-medium text-sm", msg.color)}>{msg.username}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800/50">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder={username ? "Type a message..." : "Set username to chat..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="glass-input"
                disabled={!username}
              />
              <Button type="submit" size="icon" disabled={!username || !message.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Button
        onClick={toggleChat}
        variant="outline"
        size="sm"
        className="fixed bottom-20 right-4 z-40 bg-slate-900/80 backdrop-blur-sm border-slate-800/50 hover:bg-slate-800"
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Chat
        {isOpen ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronUp className="h-4 w-4 ml-1" />}
      </Button>

      <UsernameModal
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        onUsernameSet={handleUsernameSet}
        activeUsers={activeUsers}
      />
    </>
  );
}
