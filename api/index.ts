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
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.get("/", (_req, res) => {
  res.send("<h1>Us Server! 💕</h1>");
});

io.on("connection", (socket) => {
  console.log(`Connected to socket: ${socket.id}`);

  socket.on("status", (_data) => {
    socket.broadcast.emit("status:set", true);
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected to socket: ${socket.id}`);
    socket.broadcast.emit("status:set", false);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
