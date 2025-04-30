"use client"

import { useState, useEffect } from "react"
import { StationCard } from "@/components/station-card"
import { Loader2 } from "lucide-react"

export function FeaturedStations() {
  const [stations, setStations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/popular")
      .then((res) => res.json())
      .then((data) => {
        // Take only the first 6 stations for featured section
        setStations(data.slice(0, 6))
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching featured stations:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {stations.map((station) => (
        <StationCard key={station.stationuuid} station={station} />
      ))}
    </div>
  )
}
