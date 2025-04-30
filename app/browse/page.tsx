"use client"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { SearchBar } from "@/components/search-bar"
import { MiniPlayer } from "@/components/mini-player"
import { Radio } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryList } from "@/components/category-list"
import { CountryList } from "@/components/country-list"

export default function BrowsePage() {
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
        <h1 className="text-2xl font-bold mb-6">Browse Stations</h1>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="countries">By Country</TabsTrigger>
          </TabsList>
          <TabsContent value="categories">
            <CategoryList expanded />
          </TabsContent>
          <TabsContent value="countries">
            <CountryList />
          </TabsContent>
        </Tabs>
      </main>
      <MiniPlayer />
    </div>
  )
}
