import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import authRoutes from "./src/routes/auth.js";
import resourceRoutes from "./src/routes/resources.js";
import groupRoutes from "./src/routes/groups.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Allowed origins (production + development)
const allowedOrigins = [
  process.env.CLIENT_URL,              // Vercel
  "http://localhost:5173",             // Local development
  "http://127.0.0.1:5173"
];

// ✅ Express CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Simple health route
app.get("/", (req, res) => {
  res.send("LearnLink backend is running 🚀");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/groups", groupRoutes);

// ✅ Socket.io with correct CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io events
io.on("connection", (socket) => {
  console.log("⚡ New socket connected:", socket.id);

  socket.on("join_group", (groupId) => {
    socket.join(groupId);
  });

  socket.on("send_message", ({ groupId, message, user }) => {
    io.to(groupId).emit("receive_message", {
      groupId,
      message,
      user,
      createdAt: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Connect DB & start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
  });
