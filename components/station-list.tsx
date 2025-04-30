"use client"

import { StationCard } from "@/components/station-card"

interface StationListProps {
  stations: any[]
}

export function StationList({ stations }: StationListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {stations.map((station) => (
        <StationCard key={station.stationuuid} station={station} />
      ))}
    </div>
  )
}
