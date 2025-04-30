"use client"

import { create } from "zustand"

interface ChatMessage {
  id: string
  username: string
  text: string
  timestamp: string
  color: string
}

interface ChatState {
  username: string | null
  messages: ChatMessage[]
  activeUsers: Record<string, string> // username -> color
  setUsername: (username: string) => void
  addMessage: (message: ChatMessage) => void
  addActiveUser: (username: string, color: string) => void
  removeActiveUser: (username: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  username: null,
  messages: [],
  activeUsers: {},

  setUsername: (username) => set({ username }),

  addMessage: (message) =>
    set((state) => {
      // Keep only the most recent 20 messages
      const updatedMessages = [...state.messages, message]
      if (updatedMessages.length > 20) {
        return { messages: updatedMessages.slice(-20) }
      }
      return { messages: updatedMessages }
    }),

  addActiveUser: (username, color) =>
    set((state) => ({
      activeUsers: { ...state.activeUsers, [username]: color },
    })),

  removeActiveUser: (username) =>
    set((state) => {
      const updatedUsers = { ...state.activeUsers }
      delete updatedUsers[username]
      return { activeUsers: updatedUsers }
    }),
}))
