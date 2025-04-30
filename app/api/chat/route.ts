import { NextRequest, NextResponse } from "next/server";

// In-memory message queue (ephemeral, no persistent storage)
const messageQueue: Array<{
  type: string;
  id?: string;
  username?: string;
  text?: string;
  timestamp?: string;
  color?: string;
}> = [];
const MAX_QUEUE_SIZE = 20; // Sync up to 20 recent messages for new clients
const QUEUE_TTL = 30 * 1000; // Clear messages older than 30 seconds

// Store connected clients
const clients: Set<WritableStreamDefaultWriter> = new Set();

export async function GET(req: NextRequest) {
  // Ensure GET request
  if (req.method !== "GET") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Set up encoder
      const encoder = new TextEncoder();
      const writer = controller;

      // Add client to set
      clients.add(writer);

      // Send initial messages from queue
      const recentMessages = messageQueue.filter(
        (msg) => msg.timestamp && new Date().getTime() - new Date(msg.timestamp).getTime() < QUEUE_TTL
      );
      recentMessages.forEach((msg) => {
        writer.enqueue(encoder.encode(`data: ${JSON.stringify(msg)}\n\n`));
      });

      // Clean up old messages periodically
      const cleanup = setInterval(() => {
        const now = new Date().getTime();
        while (messageQueue.length > 0 && messageQueue[0].timestamp && now - new Date(messageQueue[0].timestamp).getTime() > QUEUE_TTL) {
          messageQueue.shift();
        }
        if (messageQueue.length > MAX_QUEUE_SIZE) {
          messageQueue.splice(0, messageQueue.length - MAX_QUEUE_SIZE);
        }
      }, 10000);

      // Handle client disconnect
      req.signal.addEventListener("abort", () => {
        clients.delete(writer);
        clearInterval(cleanup);
        controller.close();
      });
    },
  });

  // Return SSE response
  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering for Vercel
    },
  });
}

// Broadcast message to all connected clients
export function broadcastMessage(message: {
  type: string;
  id?: string;
  username?: string;
  text?: string;
  timestamp?: string;
  color?: string;
}) {
  messageQueue.push(message);
  if (messageQueue.length > MAX_QUEUE_SIZE) {
    messageQueue.shift();
  }
  const encoder = new TextEncoder();
  clients.forEach((writer) => {
    try {
      writer.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
    } catch (err) {
      console.error("Error broadcasting to client:", err);
      clients.delete(writer);
    }
  });
}
