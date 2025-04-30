"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { SearchBar } from "@/components/search-bar"
import { MiniPlayer } from "@/components/mini-player"
import { Radio, Loader2, Heart, Share2, Globe, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlayerStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

export default function StationPage({ params }: { params: { id: string } }) {
  const [station, setStation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { setCurrentStation, isPlaying, currentStation, togglePlay } = usePlayerStore()

  const isCurrentStation = currentStation?.stationuuid === params.id

  useEffect(() => {
    setLoading(true)
    fetch(`/api/station/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setStation(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching station:", err)
        setLoading(false)
      })
  }, [params.id])

  const handlePlay = () => {
    if (isCurrentStation) {
      togglePlay()
    } else if (station) {
      setCurrentStation(station)
    }
  }

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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : station ? (
          <div className="glass-card rounded-xl p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="w-48 h-48 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center">
                  {station.favicon ? (
                    <img
                      src={station.favicon || "/placeholder.svg"}
                      alt={station.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=192&width=192"
                      }}
                    />
                  ) : (
                    <Radio className="h-16 w-16 text-emerald-400" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{station.name}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {station.tags
                    ?.split(",")
                    .slice(0, 5)
                    .map((tag: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-emerald-900/40 text-emerald-300">
                        {tag.trim()}
                      </Badge>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <span>{station.country || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-slate-400" />
                    <span>{station.codec || "Unknown"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handlePlay} size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                    {isCurrentStation && isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button variant="outline" size="lg" className="border-emerald-500/50 text-emerald-400">
                    <Heart className="mr-2 h-4 w-4" />
                    Favorite
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400">Station not found.</p>
            <Button asChild className="mt-4 bg-emerald-500 hover:bg-emerald-600">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        )}
      </main>
      <MiniPlayer />
    </div>
  )
}
