"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { SearchBar } from "@/components/search-bar"
import { StationList } from "@/components/station-list"
import { MiniPlayer } from "@/components/mini-player"
import { Radio, Heart } from "lucide-react"
import { useFavoritesStore } from "@/lib/favorites-store"

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore()
  const [stations, setStations] = useState<any[]>([])

  useEffect(() => {
    // Convert favorites from store to station format
    setStations(Object.values(favorites))
  }, [favorites])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/40 backdrop-blur-xl bg-black/30">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Radio className="h-6 w-6 text-emerald-400" />
            <span className="text-xl font-bold tracking-tight">Radio-X</span>
          </Link>
          <MainNav />
          <div className="ml-auto flex items-center gap-2">
            <SearchBar />
          </div>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>

        {stations.length > 0 ? (
          <StationList stations={stations} />
        ) : (
          <div className="glass-card rounded-xl p-12 text-center">
            <Heart className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-slate-400 mb-6">
              Add stations to your favorites by clicking the heart icon on any station.
            </p>
            <Link href="/popular" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4">
              Browse popular stations
            </Link>
          </div>
        )}
      </main>
      <MiniPlayer />
    </div>
  )
}
