import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { tag: string } }) {
  const tag = params.tag

  if (!tag) {
    return NextResponse.json({ error: "Category tag is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://de1.api.radio-browser.info/json/stations/bytag/${encodeURIComponent(tag)}?limit=50&hidebroken=true`,
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
    console.error("Error fetching stations by category:", error)
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 })
  }
}
