"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Play, Pause, Volume2, VolumeX, Radio, Heart } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { usePlayerStore } from "@/lib/store"
import { useFavoritesStore } from "@/lib/favorites-store"

export function MiniPlayer() {
  const { currentStation, isPlaying, togglePlay, setVolume, volume } = usePlayerStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const [isMuted, setIsMuted] = useState(false)
  const [previousVolume, setPreviousVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false)
      setVolume(previousVolume || 0.5)
    } else {
      setPreviousVolume(volume)
      setIsMuted(true)
      setVolume(0)
    }
  }

  useEffect(() => {
    if (!audioRef.current) return

    if (currentStation && isPlaying) {
      audioRef.current.src = currentStation.url
      audioRef.current.volume = volume
      audioRef.current.play().catch((err) => {
        console.error("Error playing audio:", err)
      })
    } else if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [currentStation, isPlaying, volume])

  if (!currentStation) {
    return null
  }

  const isFavoriteStation = currentStation ? isFavorite(currentStation.stationuuid) : false

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-800/40 backdrop-blur-xl bg-black/70 z-50">
      <audio ref={audioRef} />
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-800 flex items-center justify-center shrink-0">
            {currentStation.favicon ? (
              <img
                src={currentStation.favicon || "/placeholder.svg"}
                alt={currentStation.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=48&width=48"
                }}
              />
            ) : (
              <Radio className="h-6 w-6 text-emerald-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/station/${currentStation.stationuuid}`} className="hover:underline">
              <h3 className="font-semibold truncate">{currentStation.name}</h3>
            </Link>
            <p className="text-sm text-slate-400 truncate">{currentStation.country || "Unknown"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={isFavoriteStation ? "text-rose-400" : "text-slate-400"}
              onClick={() => toggleFavorite(currentStation)}
            >
              <Heart className="h-5 w-5" fill={isFavoriteStation ? "currentColor" : "none"} />
              <span className="sr-only">Favorite</span>
            </Button>
            <div className="hidden sm:flex items-center gap-2 w-32">
              <Button size="icon" variant="ghost" className="text-slate-400" onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
              </Button>
              <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
