import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://de1.api.radio-browser.info/json/tags?hidebroken=true", {
      headers: {
        "User-Agent": "radio-x-app",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Sort by station count and take top 30
    const sortedData = data.sort((a: any, b: any) => b.stationcount - a.stationcount).slice(0, 30)

    return NextResponse.json(sortedData)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
