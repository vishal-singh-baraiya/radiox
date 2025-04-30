import { NextRequest, NextResponse } from "next/server";

// In-memory stores
const messageQueue: Array<{
  type: string;
  id?: string;
  username?: string;
  text?: string;
  timestamp?: string;
  color?: string;
}> = [];
const activeUsers: Record<string, string> = {}; // username: color
const MAX_QUEUE_SIZE = 20;
const QUEUE_TTL = 60 * 1000; // 60 seconds

// Connected clients
const clients: Set<WritableStreamDefaultWriter> = new Set();

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const writer = controller;
      clients.add(writer);

      // Send initial messages
      const recentMessages = messageQueue.filter(
        (msg) => msg.timestamp && new Date().getTime() - new Date(msg.timestamp).getTime() < QUEUE_TTL
      );
      recentMessages.forEach((msg) => {
        writer.enqueue(encoder.encode(`data: ${JSON.stringify(msg)}\n\n`));
      });

      // Send active users
      const users = Object.entries(activeUsers).map(([username, color]) => ({ username, color }));
      writer.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "users", users })}\n\n`));

      // Clean up old messages
      const cleanup = setInterval(() => {
        const now = new Date().getTime();
        while (
          messageQueue.length > 0 &&
          messageQueue[0].timestamp &&
          now - new Date(messageQueue[0].timestamp).getTime() > QUEUE_TTL
        ) {
          messageQueue.shift();
        }
        if (messageQueue.length > MAX_QUEUE_SIZE) {
          messageQueue.splice(0, messageQueue.length - MAX_QUEUE_SIZE);
        }
      }, 10000);

      // Handle disconnect
      req.signal.addEventListener("abort", () => {
        clients.delete(writer);
        clearInterval(cleanup);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export function broadcastMessage(message: {
  type: string;
  id?: string;
  username?: string;
  text?: string;
  timestamp?: string;
  color?: string;
}) {
  if (message.type === "user-joined" && message.username && message.color) {
    activeUsers[message.username] = message.color;
  } else if (message.type === "user-left" && message.username) {
    delete activeUsers[message.username];
  }

  messageQueue.push(message);
  if (messageQueue.length > MAX_QUEUE_SIZE) {
    messageQueue.shift();
  }

  const encoder = new TextEncoder();
  clients.forEach((writer) => {
    try {
      writer.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
    } catch (err) {
      console.error("Error broadcasting:", err);
      clients.delete(writer);
    }
  });
}
