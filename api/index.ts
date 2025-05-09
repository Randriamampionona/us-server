import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT!;
const ORIGIN = process.env.ORIGIN!;

const io = new Server(server, {
  cors: {
    origin: ORIGIN,
    methods: ["GET", "DELETE", "PUT", "POST"],
  },
});

app.get("/", (_req, res) => {
  res.send("<h1>Us Server! 💕</h1>");
});

const onlineUsers = new Map<string, string>(); // userId -> socket.id

io.on("connection", (socket) => {
  // User sends their ID
  socket.on("user:connect", (userId: string) => {
    socket.data.userId = userId;
    onlineUsers.set(userId, socket.id);

    // Notify the user's friends (e.g., a specific other user) they are online
    socket.broadcast.emit("user:status", { userId, isOnline: true });
  });

  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    if (userId) {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user:status", { userId, isOnline: false });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
