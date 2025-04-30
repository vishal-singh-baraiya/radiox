"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  defaultValue?: string
}

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  useEffect(() => {
    setQuery(defaultValue)
  }, [defaultValue])

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search stations..."
        className="glass-input pr-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  )
}
