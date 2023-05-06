import { useGameDetailsContext } from "@/context/game-details-context";
import { useUserContext } from "@/context/user-context";
import { socket } from "@/utils/socket";
import { LeaveChannelMessage } from "@/utils/type";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useRouteChange = () => {
  const router = useRouter();
  const { state, dispatch } = useGameDetailsContext();
  const { dispatch: userDispatch } = useUserContext();
  const { channel } = state;

  useEffect(() => {
    const onRouteChange = () => {
      let message: LeaveChannelMessage;
      if (channel) {
        message = {
          channel,
        };
        socket.emit("leave_channel", {
          channel,
        });
      }
      dispatch({
        type: "RESET",
      });
      userDispatch({
        type: "RESET",
      });
    };
    router.events.on("routeChangeStart", onRouteChange);

    return () => {
      router.events.off("routeChangeStart", onRouteChange);
    };
  }, [router, channel, dispatch, userDispatch]);
};

export default useRouteChange;
