"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FavoritesState {
  favorites: Record<string, any>
  toggleFavorite: (station: any) => void
  isFavorite: (stationId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},
      toggleFavorite: (station) => {
        set((state) => {
          const newFavorites = { ...state.favorites }

          if (newFavorites[station.stationuuid]) {
            delete newFavorites[station.stationuuid]
          } else {
            newFavorites[station.stationuuid] = station
          }

          return { favorites: newFavorites }
        })
      },
      isFavorite: (stationId) => {
        return !!get().favorites[stationId]
      },
    }),
    {
      name: "radio-x-favorites",
    },
  ),
)
