import { NextApiRequest, NextApiResponse } from "next";
import { broadcastMessage } from "./chat";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, id, username, text, timestamp, color } = req.body;

    if (!type || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = { type, id, username, text, timestamp, color };
    broadcastMessage(message);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error sending message:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
