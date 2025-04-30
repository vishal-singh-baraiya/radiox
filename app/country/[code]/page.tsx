"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { SearchBar } from "@/components/search-bar"
import { StationList } from "@/components/station-list"
import { MiniPlayer } from "@/components/mini-player"
import { Radio, Loader2 } from "lucide-react"

export default function CountryPage({ params }: { params: { code: string } }) {
  const [stations, setStations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [countryName, setCountryName] = useState("")
  const code = params.code

  useEffect(() => {
    fetch(`/api/country/${code}`)
      .then((res) => res.json())
      .then((data) => {
        setStations(data)
        if (data.length > 0) {
          setCountryName(data[0].country)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching stations by country:", err)
        setLoading(false)
      })
  }, [code])

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
        <h1 className="text-2xl font-bold mb-6">{countryName ? `Stations in ${countryName}` : `Country: ${code}`}</h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : (
          <>
            {stations.length > 0 ? (
              <StationList stations={stations} />
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">No stations found for this country.</p>
                <Link
                  href="/browse"
                  className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 mt-4 inline-block"
                >
                  Browse all countries
                </Link>
              </div>
            )}
          </>
        )}
      </main>
      <MiniPlayer />
    </div>
  )
}
