import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Vite frontend
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);
  socket.emit("hello", "Hello from server!");
});

server.listen(5000, () => {
  console.log("✅ Socket.IO test server running on http://localhost:4000");
});
