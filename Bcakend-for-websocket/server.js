require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app); // Create HTTP server

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors()); // Enable CORS

const io = new Server(server, { //create a websocket server
  cors: {
    origin: frontendUrl,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // handle the messages to be send or receive
  socket.on("message", (data) => {
    console.log("Received message:", data);
    // Broadcast the message to all connected clients except sender
    socket.broadcast.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const port = process.env.PORT || 3001;
// Start the server on PORT 3001
server.listen(port, () => {
  console.log(`WebSocket server running on ws://${frontendUrl.replace(/^https?:\/\//, "")} or ws://localhost:${port}`);
});
