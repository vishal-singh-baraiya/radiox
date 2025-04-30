import { NextRequest, NextResponse } from "next/server";
import { broadcastMessage } from "../chat/route";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { type, id, username, text, timestamp, color } = await req.json();

    if (!type || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type === "message" && (!text || text.length > 200)) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    broadcastMessage({ type, id, username, text, timestamp, color });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error sending message:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
