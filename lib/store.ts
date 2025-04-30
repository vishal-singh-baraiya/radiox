"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface PlayerState {
  currentStation: any | null
  isPlaying: boolean
  volume: number
  setCurrentStation: (station: any) => void
  togglePlay: () => void
  setVolume: (volume: number) => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      currentStation: null,
      isPlaying: false,
      volume: 0.8,
      setCurrentStation: (station) => set({ currentStation: station, isPlaying: true }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: "radio-x-player",
    },
  ),
)
