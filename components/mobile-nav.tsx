"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", active: pathname === "/" },
    {
      href: "/browse",
      label: "Browse",
      active: pathname === "/browse" || pathname.startsWith("/category/") || pathname.startsWith("/country/"),
    },
    { href: "/popular", label: "Popular", active: pathname === "/popular" },
    { href: "/favorites", label: "Favorites", active: pathname === "/favorites" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-black/95 backdrop-blur-xl border-slate-800">
        <div className="flex items-center gap-2 mb-8">
          
          <span className="text-xl font-bold tracking-tight">Radio-X</span>
        </div>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-base font-medium transition-colors hover:text-primary p-2 rounded-md",
                item.active ? "text-primary bg-emerald-900/20" : "text-muted-foreground",
              )}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
