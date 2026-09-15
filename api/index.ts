import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

/**
 * ⚠️ HOSTING NOTE
 * This is a long-lived Socket.IO server. Vercel serverless functions (which is
 * what `vercel.json` deploys this as) are stateless and short-lived and do NOT
 * support persistent WebSocket connections — the connection falls back to slow
 * HTTP long-polling and the in-memory state resets between invocations. Deploy
 * this on a platform that keeps a process alive: Railway, Render, Fly.io, or a
 * small VPS. Point NEXT_PUBLIC_SERVER_URL on the frontend at that host.
 */

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || "8080";
const ORIGIN = process.env.ORIGIN;

if (!ORIGIN) {
  // Fail fast instead of silently allowing an undefined CORS origin.
  throw new Error("Missing ORIGIN environment variable");
}

// Support multiple comma-separated origins (e.g. prod + preview URLs).
const allowedOrigins = ORIGIN.split(",").map((o) => o.trim());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"], // the Socket.IO handshake only needs these
  },
});

app.get("/", (_req, res) => {
  res.send("<h1>Us Server! 💕</h1>");
});

io.on("connection", (socket) => {
  socket.on("status", () => {
    // Tell everyone else this peer is online.
    socket.broadcast.emit("status:set", true);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("status:set", false);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
