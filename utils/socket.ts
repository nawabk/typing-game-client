import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "development"
    ? "http://192.168.0.132:5000"
    : "https://typing-fight.onrender.com/";

export const socket = io(URL, {
  autoConnect: false,
});
