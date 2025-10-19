import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { players } from "./data/players.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: false }));
app.use(express.json());

const PORT = process.env.PORT || 4000;
const N8N_WORKFLOW_URL = process.env.N8N_WORKFLOW_URL; // expects full URL

if (!N8N_WORKFLOW_URL) {
  console.error("Missing N8N_WORKFLOW_URL in env");
  process.exit(1);
}

// Simple health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Players list endpoint (mock data)
app.get("/api/players", (_req, res) => {
  res.json({ players });
});

// Chat endpoint: forwards message to n8n workflow and returns answer
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message (string) required" });
    }

    // POST to n8n workflow
    const workflowResponse = await fetch(N8N_WORKFLOW_URL, {
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
    res.json({ answer: data.answer ?? data });
  } catch (err) {
    console.error("Error calling n8n workflow", err);
    res.status(500).json({ error: "internal", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API listening on http://localhost:${PORT}`);
});
