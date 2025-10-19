const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app); // Create HTTP server

app.use(cors()); // Enable CORS

const io = new Server(server, { //create a websocket server
  cors: {
    origin: "http://localhost:3000", // Change this in production
    methods: ["GET", "POST"],
  },
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

//   handle the messages to be send or receive
  socket.on("message", (data) => {
    console.log("Received message:", data);
    io.emit("message", data); // Broadcast message
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server on PORT 3001
server.listen(3001, () => {
  console.log("WebSocket server running on ws://localhost:3001");
});
