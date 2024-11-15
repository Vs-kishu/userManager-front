import { io } from "socket.io-client";

const userId = JSON.parse(localStorage.getItem("userToken"))?.userId;

const socket = io("https://user-management-flax-three.vercel.app", {
  query: { userId: userId },
 transports: ["polling", "websocket"], // Force WebSocket transport
  reconnectionAttempts: 5,   // Try to reconnect 5 times
  reconnectionDelay: 1000,   // Wait 1 second between reconnection attempts
  timeout: 20000            // Increase timeout to 20 seconds
});

export default socket;