import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("🔌 Connecting to Socket.IO server...");
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    const socketInstance = io(socketUrl); // Connect to backend

    socketInstance.on("connect", () => {
      console.log("✅ Connected to Socket.IO server:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
    });

    setSocket(socketInstance);

    return () => {
      console.log("🔌 Disconnecting socket...");
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
