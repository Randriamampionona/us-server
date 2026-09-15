import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

/**
 * ⚠️ HOSTING NOTE
 * This is a long-lived Socket.IO server. Vercel serverless functions do NOT
 * support persistent WebSocket connections — deploy on a platform that keeps a
 * process alive: Railway, Render, Fly.io, or a small VPS. Point
 * NEXT_PUBLIC_SERVER_URL on the frontend at that host.
 */

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || "8080";
const ORIGIN = process.env.ORIGIN;

if (!ORIGIN) {
  throw new Error("Missing ORIGIN environment variable");
}

// Support multiple comma-separated origins (e.g. prod + preview URLs).
const allowedOrigins = ORIGIN.split(",").map((o) => o.trim());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

const APP_URL = "https://us-2-0.vercel.app/";

const LANDING_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Us Server 💕</title>
  <meta name="description" content="Backend service for the Us app — up and running." />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100dvh;
      display: flex; align-items: center; justify-content: center;
      padding: 24px; overflow: hidden; color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background:
        radial-gradient(1200px 600px at 18% 8%, #7b2ff7 0%, transparent 58%),
        radial-gradient(1000px 700px at 92% 92%, #ff4d6d 0%, transparent 55%),
        linear-gradient(135deg, #1a1030 0%, #2b1055 100%);
      background-attachment: fixed;
    }
    .bg-hearts { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
    .bg-hearts span {
      position: absolute; bottom: -48px; font-size: 22px; opacity: .16;
      animation: float linear infinite;
    }
    @keyframes float { to { transform: translateY(-118vh) rotate(360deg); } }

    .card {
      position: relative; width: 100%; max-width: 460px;
      padding: clamp(28px, 5vw, 44px); text-align: center;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 24px;
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
      animation: rise .7s cubic-bezier(.2, .8, .2, 1) both;
    }
    @keyframes rise {
      from { opacity: 0; transform: translateY(18px) scale(.98); }
      to   { opacity: 1; transform: none; }
    }

    .badge {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 13px; font-weight: 600; letter-spacing: .02em;
      padding: 6px 12px; border-radius: 999px; margin-bottom: 22px;
      background: rgba(46, 204, 113, 0.14);
      border: 1px solid rgba(46, 204, 113, 0.35);
      color: #7cffb0;
    }
    .dot {
      width: 8px; height: 8px; border-radius: 50%; background: #2ecc71;
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0%   { box-shadow: 0 0 0 0 rgba(46, 204, 113, .6); }
      70%  { box-shadow: 0 0 0 10px rgba(46, 204, 113, 0); }
      100% { box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
    }

    h1 {
      font-size: clamp(28px, 6vw, 40px); font-weight: 800; line-height: 1.1;
      margin-bottom: 10px;
      background: linear-gradient(90deg, #fff, #ffd0dc);
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    p.lead {
      font-size: clamp(14px, 3.5vw, 16px); line-height: 1.6;
      color: rgba(255, 255, 255, 0.75); margin-bottom: 28px;
    }

    a.cta {
      display: inline-flex; align-items: center; gap: 10px;
      font-size: 16px; font-weight: 700; text-decoration: none;
      padding: 14px 26px; border-radius: 14px; color: #2b1055;
      background: linear-gradient(180deg, #ffffff, #ffe3ea);
      box-shadow: 0 10px 24px rgba(255, 77, 109, 0.35);
      transition: transform .15s ease, box-shadow .15s ease;
    }
    a.cta:hover { transform: translateY(-2px); box-shadow: 0 16px 30px rgba(255, 77, 109, 0.45); }
    a.cta:active { transform: translateY(0); }
    a.cta .arrow { transition: transform .15s ease; }
    a.cta:hover .arrow { transform: translateX(4px); }

    footer { margin-top: 26px; font-size: 12px; color: rgba(255, 255, 255, 0.45); }
    footer a { color: rgba(255, 255, 255, 0.7); text-decoration: none; }

    @media (prefers-reduced-motion: reduce) {
      .card, .dot, .bg-hearts span { animation: none !important; }
    }
  </style>
</head>
<body>
  <div class="bg-hearts" aria-hidden="true">
    <span style="left: 8%;  animation-duration: 14s; animation-delay: 0s;">💕</span>
    <span style="left: 24%; animation-duration: 18s; animation-delay: 3s;">💗</span>
    <span style="left: 45%; animation-duration: 12s; animation-delay: 1s;">❤️</span>
    <span style="left: 63%; animation-duration: 20s; animation-delay: 5s;">💞</span>
    <span style="left: 82%; animation-duration: 16s; animation-delay: 2s;">💖</span>
  </div>

  <main class="card">
    <span class="badge"><span class="dot"></span> Server Operational</span>
    <h1>Us Server 💕</h1>
    <p class="lead">
      The backend is up and running — quietly powering your conversations.
      There's nothing to see here, so head over to the app.
    </p>
    <a class="cta" href="${APP_URL}" target="_blank" rel="noopener noreferrer">
      Launch App <span class="arrow">→</span>
    </a>
    <footer>
      By <a href="https://tooj-rtn.vercel.app/" target="_blank" rel="noopener noreferrer">Tooj Rtn</a>
      &copy; <span id="y"></span>
    </footer>
  </main>

  <script>document.getElementById("y").textContent = new Date().getFullYear();</script>
</body>
</html>`;

app.get("/", (_req, res) => {
  res.type("html").send(LANDING_PAGE);
});

io.on("connection", (socket) => {
  socket.on("status", () => {
    socket.broadcast.emit("status:set", true);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("status:set", false);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
