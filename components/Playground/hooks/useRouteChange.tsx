import { useGameDetailsContext } from "@/context/game-details-context";
import { socket } from "@/utils/socket";
import { LeaveChannelMessage } from "@/utils/type";
import { useRouter } from "next/router";
import { useEffect } from "react";

const useRouteChange = () => {
  const router = useRouter();
  const { state, dispatch } = useGameDetailsContext();
  const { channel } = state;

  useEffect(() => {
    const onRouteChange = () => {
      console.log("Leaving");
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
    };
    router.events.on("routeChangeStart", onRouteChange);

    return () => {
      router.events.off("routeChangeStart", onRouteChange);
    };
  }, [router, channel, dispatch]);
};

export default useRouteChange;
