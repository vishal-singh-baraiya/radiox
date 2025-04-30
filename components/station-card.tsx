"use client"

import type React from "react"

import Link from "next/link"
import { Play, Radio, Heart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePlayerStore } from "@/lib/store"
import { useFavoritesStore } from "@/lib/favorites-store"

interface StationCardProps {
  station: any
}

export function StationCard({ station }: StationCardProps) {
  const { setCurrentStation, currentStation, isPlaying, togglePlay } = usePlayerStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()

  const isCurrentStation = currentStation?.stationuuid === station.stationuuid
  const isFavoriteStation = isFavorite(station.stationuuid)

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isCurrentStation) {
      togglePlay()
    } else {
      setCurrentStation(station)
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(station)
  }

  return (
    <Link href={`/station/${station.stationuuid}`}>
      <Card className="glass-card glass-card-hover h-full overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-800 flex items-center justify-center shrink-0">
              {station.favicon ? (
                <img
                  src={station.favicon || "/placeholder.svg"}
                  alt={station.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                  }}
                />
              ) : (
                <Radio className="h-8 w-8 text-emerald-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{station.name}</h3>
              <p className="text-sm text-slate-400 truncate">{station.country || "Unknown"}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {station.tags
                  ?.split(",")
                  .slice(0, 2)
                  .map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary" className="bg-emerald-900/40 text-emerald-300 text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-2 flex justify-between border-t border-slate-800/50">
          <Button
            size="sm"
            variant="ghost"
            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
            onClick={handlePlay}
          >
            <Play className="h-4 w-4 mr-1" />
            {isCurrentStation && isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={isFavoriteStation ? "text-rose-400" : "text-slate-400"}
            onClick={handleFavorite}
          >
            <Heart className="h-4 w-4" fill={isFavoriteStation ? "currentColor" : "none"} />
            <span className="sr-only">Favorite</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
