"use client"

import { useState, useEffect } from "react"
import { StationCard } from "@/components/station-card"
import { Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LocalStations() {
  const [stations, setStations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState<string | null>(null)
  const [countryCode, setCountryCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getUserCountry() {
      try {
        // First try to get country from localStorage (if previously detected)
        const savedCountry = localStorage.getItem("userCountry")
        const savedCountryCode = localStorage.getItem("userCountryCode")

        if (savedCountry && savedCountryCode) {
          setCountry(savedCountry)
          setCountryCode(savedCountryCode)
          fetchStationsByCountry(savedCountryCode)
          return
        }

        // If not in localStorage, try to get from IP geolocation
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()

        if (data.country_name && data.country_code) {
          setCountry(data.country_name)
          setCountryCode(data.country_code)

          // Save to localStorage for future visits
          localStorage.setItem("userCountry", data.country_name)
          localStorage.setItem("userCountryCode", data.country_code)

          fetchStationsByCountry(data.country_code)
        } else {
          // Default to United States if detection fails
          setCountry("United States")
          setCountryCode("US")
          fetchStationsByCountry("US")
        }
      } catch (err) {
        console.error("Error detecting country:", err)
        setError("Could not detect your country")
        setLoading(false)

        // Default to United States if detection fails
        setCountry("United States")
        setCountryCode("US")
        fetchStationsByCountry("US")
      }
    }

    async function fetchStationsByCountry(code: string) {
      try {
        const response = await fetch(`/api/country/${code}?limit=6`)
        const data = await response.json()

        if (data.length > 0) {
          setStations(data.slice(0, 6))
        } else {
          setError(`No stations found for ${country}`)
        }
        setLoading(false)
      } catch (err) {
        console.error("Error fetching local stations:", err)
        setError("Could not load stations from your country")
        setLoading(false)
      }
    }

    getUserCountry()
  }, [country])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (error && !stations.length) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">{error}</h3>
        <p className="text-slate-400 mb-6">Try browsing stations by country instead.</p>
        <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
          <Link href="/browse">Browse All Countries</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      {country && (
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-emerald-400" />
          <p className="text-slate-300">
            Showing stations from <span className="font-medium text-white">{country}</span>
          </p>
          {countryCode && (
            <Button asChild variant="link" className="text-emerald-400 p-0 h-auto">
              <Link href={`/country/${countryCode}`}>View all</Link>
            </Button>
          )}
        </div>
      )}

      {stations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stations.map((station) => (
            <StationCard key={station.stationuuid} station={station} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-8 text-center">
          <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No stations found</h3>
          <p className="text-slate-400 mb-6">We couldn't find any stations from {country}.</p>
          <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
            <Link href="/browse">Browse All Countries</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
