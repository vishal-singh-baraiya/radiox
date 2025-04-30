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

    // Additional validation for security
    if (text && text.length > 200) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    const message = { type, id, username, text, timestamp, color };
    broadcastMessage(message);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error sending message:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
