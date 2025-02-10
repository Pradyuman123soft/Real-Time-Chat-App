// import { Server } from "socket.io";

// export default function handler(req, res) {
//   if (!res.socket.server.io) {
//     console.log("Setting up Socket.IO server...");

//     const io = new Server(res.socket.server, {
//       path: "/api/socket",
//       cors: {
//         origin: "*", // Replace with your frontend URL if needed
//         methods: ["GET", "POST"],
//       },
//     });

//     io.on("connection", (socket) => {
//       console.log("A user connected:", socket.id);

//       socket.on("message", (data) => {
//         console.log("Received message:", data);
//         io.emit("message", data); // Broadcast message
//       });

//       socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//       });
//     });

//     res.socket.server.io = io; // Attach Socket.IO instance to avoid duplicate servers
//   }

//   res.end(); // End response
// }

// this isn't work prorperly because websocket needs a long lived server that's why i create a new backend Server.js to handle the websocket only