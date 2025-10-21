import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import {
  store,
  addPlayer,
  removePlayer,
  addGame,
  getLeaderboardCached,
  LEADERBOARD_TTL_MS,
} from "./store.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: false }));
app.use(express.json());

// Data & leaderboard logic moved to store.js; endpoints remain thin.

// ------------------------------------------------------------
// Players endpoints
// ------------------------------------------------------------
app.get("/api/players", (_req, res) => {
  res.json({ players: store.players });
});

app.post("/api/players", (req, res) => {
  const { name } = req.body || {};
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name (string) required" });
  }
  const player = addPlayer(name);
  res.status(201).json({ player });
});

app.delete("/api/players/:id", (req, res) => {
  const { id } = req.params;
  const ok = removePlayer(id);
  if (!ok) return res.status(404).json({ error: "player not found" });
  res.json({ ok: true });
});

// ------------------------------------------------------------
// Games endpoints
// ------------------------------------------------------------
app.get("/api/games", (_req, res) => {
  res.json({ games: store.games });
});

app.post("/api/games", (req, res) => {
  const { playerAId, playerBId, scoreA, scoreB } = req.body || {};
  if (!playerAId || !playerBId || playerAId === playerBId) {
    return res
      .status(400)
      .json({ error: "playerAId and playerBId must be different" });
  }
  if (typeof scoreA !== "number" || typeof scoreB !== "number") {
    return res.status(400).json({ error: "scoreA and scoreB must be numbers" });
  }
  if (scoreA === scoreB) {
    return res.status(400).json({ error: "Game cannot end in a draw" });
  }
  if (
    !store.players.find((p) => p.id === playerAId) ||
    !store.players.find((p) => p.id === playerBId)
  ) {
    return res.status(400).json({ error: "Both players must exist" });
  }
  const game = addGame({ playerAId, playerBId, scoreA, scoreB });
  res.status(201).json({ game });
});

// ------------------------------------------------------------
// Leaderboard endpoint (cached)
// ------------------------------------------------------------
app.get("/api/leaderboard", (_req, res) => {
  const leaderboard = getLeaderboardCached();
  res.json({ leaderboard, cached: true, ttlMs: LEADERBOARD_TTL_MS });
});
const PORT = process.env.PORT || 4000;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL; // expects full URL

if (!N8N_WEBHOOK_URL) {
  console.error("Missing N8N_WEBHOOK_URL in env");
  process.exit(1);
}

// Simple health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Duplicate players endpoint removed (was declared above)

// Chat endpoint: forwards message to n8n workflow and returns answer
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message (string) required" });
    }

    // POST to n8n workflow
    const workflowResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!workflowResponse.ok) {
      const text = await workflowResponse.text();
      return res
        .status(workflowResponse.status)
        .json({ error: "n8n error", details: text });
    }

    // Assume n8n returns JSON { answer: string }
    const data = await workflowResponse.json();
    console.log("n8n response:", data);
    res.json({ answer: data.body.answer ?? data });
  } catch (err) {
    console.error("Error calling n8n workflow", err);
    res.status(500).json({ error: "internal", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API listening on http://localhost:${PORT}`);
});
