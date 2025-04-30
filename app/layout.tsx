import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ChatPanel } from "@/components/chat/chat-panel"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Radio-X | Stream Radio Stations Worldwide",
  description: "Listen to thousands of radio stations from around the world",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <title>RadioX | Stream Radio Stations Worldwide"</title>
    <meta name="description" content="Listen to thousands of radio stations from around the world" />
    <meta name="keywords" content="radio, songs, radiox" />
    <link rel="icon" href="https://static-00.iconduck.com/assets.00/radio-icon-512x512-1fsdmutz.png" sizes="any" />
      <body className={`${inter.className} bg-gradient-to-br from-black to-slate-900 min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
          <ChatPanel />
        </ThemeProvider>
      </body>
    </html>
  )
}
