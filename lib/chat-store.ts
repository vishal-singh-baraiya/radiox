"use client";

import { create } from "zustand";
import Dexie from "dexie";

interface ChatMessage {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  color: string;
}

interface ChatState {
  username: string | null;
  messages: ChatMessage[];
  activeUsers: Record<string, string>;
  setUsername: (username: string) => void;
  addMessage: (message: ChatMessage) => Promise<void>;
  setMessages: (messages: ChatMessage[]) => void;
  setActiveUsers: (users: Array<{ username: string; color: string }>) => void;
  addActiveUser: (username: string, color: string) => void;
  removeActiveUser: (username: string) => void;
}

const db = new Dexie("RadioXChatDB");
db.version(1).stores({
  messages: "id, username, text, timestamp, color",
});

const MAX_MESSAGES = 20;

export const useChatStore = create<ChatState>((set) => ({
  username: null,
  messages: [],
  activeUsers: {},

  setUsername: (username) => set({ username }),

  addMessage: async (message) => {
    await db.table("messages").add(message);
    const count = await db.table("messages").count();
    if (count > MAX_MESSAGES) {
      const oldest = await db.table("messages").orderBy("timestamp").first();
      if (oldest?.id) {
        await db.table("messages").delete(oldest.id);
      }
    }
    const updatedMessages = await db.table("messages").orderBy("timestamp").toArray();
    set({ messages: updatedMessages });
  },

  setMessages: (messages) => set({ messages }),

  setActiveUsers: (users) =>
    set({
      activeUsers: users.reduce((acc, { username, color }) => ({ ...acc, [username]: color }), {}),
    }),

  addActiveUser: (username, color) =>
    set((state) => ({
      activeUsers: { ...state.activeUsers, [username]: color },
    })),

  removeActiveUser: (username) =>
    set((state) => {
      const updatedUsers = { ...state.activeUsers };
      delete updatedUsers[username];
      return { activeUsers: updatedUsers };
    }),
}));
