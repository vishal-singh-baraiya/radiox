import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json([])
  }

  try {
    const response = await fetch(
      `https://de1.api.radio-browser.info/json/stations/byname/${encodeURIComponent(query)}?limit=50&hidebroken=true`,
      {
        headers: {
          "User-Agent": "radio-x-app",
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error searching stations:", error)
    return NextResponse.json({ error: "Failed to search stations" }, { status: 500 })
  }
}
