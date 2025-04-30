import type { Metadata } from "next"
import Link from "next/link"
import { Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { FeaturedStations } from "@/components/featured-stations"
import { CategoryList } from "@/components/category-list"
import { MiniPlayer } from "@/components/mini-player"
import { SearchBar } from "@/components/search-bar"
import { LocalStations } from "@/components/local-stations"

export const metadata: Metadata = {
  title: "Radio-X | Stream Radio Stations Worldwide",
  description: "Listen to thousands of radio stations from around the world",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/40 backdrop-blur-xl bg-black/30">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Radio className="h-6 w-6 text-emerald-400" />
            <span className="text-xl font-bold tracking-tight">RadioX</span>
          </Link>
          <MainNav />
          <div className="ml-auto flex items-center gap-2">
            <SearchBar />
            <MobileNav />
          </div>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6 sm:px-6 relative">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              Stream <span className="text-emerald-400">Thousands</span> of Radio Stations
            </h1>
            <p className="max-w-[700px] text-lg text-slate-400 md:text-xl">
              Discover and listen to radio stations from around the world. Search by genre, country, or name.
            </p>
            <div className="flex sm:flex-row gap-4 mt-4">
              <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                <Link href="/browse">Browse Stations</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-emerald-500 text-emerald-400">
                <Link href="/popular">Popular Stations</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">Featured Stations</h2>
          <FeaturedStations />
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">Stations From Your Country</h2>
          <LocalStations />
        </section>

        <section className="py-8">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <CategoryList />
        </section>
        <p className="text-2xl font-bold mb-6">Made with ❤️ by 𝗧𝗵𝗲𝗩𝗶χ𝗵𝗮𝗹</p>
      </main>
      <MiniPlayer />
    </div>
    
  )
}
