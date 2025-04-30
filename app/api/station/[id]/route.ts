import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ error: "Station ID is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://de1.api.radio-browser.info/json/stations/byuuid/${id}`, {
      headers: {
        "User-Agent": "radio-x-app",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (Array.isArray(data) && data.length > 0) {
      return NextResponse.json(data[0])
    } else {
      return NextResponse.json({ error: "Station not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error fetching station:", error)
    return NextResponse.json({ error: "Failed to fetch station" }, { status: 500 })
  }
}
