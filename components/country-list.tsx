"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CountryList() {
  const [countries, setCountries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/countries")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching countries:", err)
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
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2">
          {countries.map((country) => (
            <Link key={country.name} href={`/country/${encodeURIComponent(country.iso_3166_1)}`}>
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm cursor-pointer hover:bg-emerald-900/20 border-emerald-500/30"
              >
                {country.name}
                <span className="ml-2 text-xs text-slate-400">({country.stationcount})</span>
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
