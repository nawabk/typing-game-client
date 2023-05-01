import { io } from "socket.io-client";

const URL = "http://192.168.0.132:5000";

export const socket = io(URL, {
  autoConnect: false,
});
