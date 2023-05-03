import { useGameDetailsContext } from "@/context/game-details-context";
import { socket } from "@/utils/socket";
import { useEffect } from "react";

const useSocketEvents = () => {
  const { dispatch } = useGameDetailsContext();
  useEffect(() => {
    function onRematchRequest() {
      dispatch({
        type: "COMPETITOR_ASKING_REMATCH",
      });
    }
    socket.on("rematch_request", onRematchRequest);

    return () => {
      socket.off("rematch_request");
    };
  }, [dispatch]);
};

export default useSocketEvents;
