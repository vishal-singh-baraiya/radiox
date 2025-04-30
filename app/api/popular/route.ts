import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://de1.api.radio-browser.info/json/stations/topvote/100?hidebroken=true", {
      headers: {
        "User-Agent": "radio-x-app",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching popular stations:", error)
    return NextResponse.json({ error: "Failed to fetch popular stations" }, { status: 500 })
  }
}
