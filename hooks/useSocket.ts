import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import io from "socket.io-client";

let socket: Socket | null = null;
const useSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });
  }
  return socket;
};

export default useSocket;
