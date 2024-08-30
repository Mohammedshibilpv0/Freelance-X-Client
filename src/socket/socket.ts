import { io, Socket } from "socket.io-client";

export let socket: Socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000");
    // socket = io("https://qnn863k8-3000.inc1.devtunnels.ms");

    console.log("Socket initialized with id:", socket);
  }
};
