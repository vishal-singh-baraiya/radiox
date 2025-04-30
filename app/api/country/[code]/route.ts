import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code
  const searchParams = request.nextUrl.searchParams
  const limit = searchParams.get("limit") || "50"

  if (!code) {
    return NextResponse.json({ error: "Country code is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://de1.api.radio-browser.info/json/stations/bycountrycodeexact/${encodeURIComponent(code)}?limit=${limit}&hidebroken=true`,
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
    console.error("Error fetching stations by country:", error)
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 })
  }
}
