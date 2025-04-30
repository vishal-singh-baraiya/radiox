"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
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
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            item.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
