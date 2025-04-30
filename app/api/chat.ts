import { NextApiRequest, NextApiResponse } from "next";

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
const clients: Set<NextApiResponse> = new Set();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable buffering for Vercel

  // Add client to set
  clients.add(res);

  // Send initial messages from queue
  const recentMessages = messageQueue.filter(
    (msg) => msg.timestamp && new Date().getTime() - new Date(msg.timestamp).getTime() < QUEUE_TTL
  );
  recentMessages.forEach((msg) => {
    res.write(`data: ${JSON.stringify(msg)}\n\n`);
  });

  // Keep connection open
  req.socket.on("close", () => {
    clients.delete(res);
    res.end();
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
  res.on("close", () => {
    clients.delete(res);
    clearInterval(cleanup);
    res.end();
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
  clients.forEach((client) => {
    if (client.writable) {
      client.write(`data: ${JSON.stringify(message)}\n\n`);
    }
  });
}
