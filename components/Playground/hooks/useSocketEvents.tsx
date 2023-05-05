import { useGameDetailsContext } from "@/context/game-details-context";
import { useUserContext } from "@/context/user-context";
import { socket } from "@/utils/socket";
import { RematchMessage } from "@/utils/type";
import { Dispatch, useEffect } from "react";

interface Props {
  setStartGame: Dispatch<boolean>;
  setStopGame: Dispatch<boolean>;
}
const useSocketEvents = ({ setStartGame, setStopGame }: Props) => {
  const { dispatch } = useGameDetailsContext();
  const { dispatch: userDispatch } = useUserContext();
  useEffect(() => {
    function onRematchRequest() {
      dispatch({
        type: "COMPETITOR_ASKING_REMATCH",
      });
    }

    function onRematch(message: RematchMessage) {
      const { paragraph } = message;
      dispatch({
        type: "SET_FOR_REMATCH",
        payload: {
          paragraph,
        },
      });
      userDispatch({
        type: "SET_FOR_REMATCH",
      });
      setStartGame(false);
      setStopGame(false);
    }

    socket.on("rematch_request", onRematchRequest);
    socket.on("rematch", onRematch);

    return () => {
      socket.off("rematch_request");
      socket.off("rematch");
    };
  }, [dispatch, userDispatch, setStartGame, setStopGame]);
};

export default useSocketEvents;
