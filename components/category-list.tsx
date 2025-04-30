"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CategoryListProps {
  expanded?: boolean
}

export function CategoryList({ expanded = false }: CategoryListProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching categories:", err)
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

  // If not expanded, only show first 12 categories
  const displayCategories = expanded ? categories : categories.slice(0, 12)

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2">
          {displayCategories.map((category) => (
            <Link key={category.name} href={`/category/${encodeURIComponent(category.name)}`}>
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm cursor-pointer hover:bg-emerald-900/20 border-emerald-500/30"
              >
                {category.name}
                <span className="ml-2 text-xs text-slate-400">({category.stationcount})</span>
              </Badge>
            </Link>
          ))}
        </div>

        {!expanded && (
          <div className="mt-4 text-center">
            <Link href="/browse" className="text-emerald-400 hover:text-emerald-300 text-sm">
              View all categories
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
