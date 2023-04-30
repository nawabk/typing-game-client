import { useUserContext } from "@/context/user-context";
import { socket } from "@/utils/socket";
import { useEffect } from "react";

const useSocketInit = () => {
  const { dispatch } = useUserContext();
  useEffect(() => {
    function onConnect() {
      console.log("connected");
      dispatch({
        type: "SET_SOCKET_DETAILS",
        payload: {
          id: socket.id,
        },
      });
    }

    function onDisconnect() {
      // try connecting after 5 seconds
      setTimeout(() => {
        socket.connect();
      }, 5000);
    }

    socket.on("connect", onConnect);

    socket.on("disconnect", onDisconnect);

    //socket connect
    socket.connect();
    console.log("calling connect");

    return () => {
      socket.off("connect", onConnect);
      socket.disconnect();
    };
  }, [dispatch]);
};

export default useSocketInit;
