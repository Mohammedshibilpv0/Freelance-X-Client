import { io, Socket } from "socket.io-client";
import { BACKENDENDPOINT } from "../utility/env";

export let socket: Socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(BACKENDENDPOINT);
    console.log("Socket initialized with id:", socket);
  }
};
