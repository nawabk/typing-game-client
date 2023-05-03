import styles from "../../styles/Playground.module.css";
import Countdown from "./Countdown";
import { useEffect, useRef, useState } from "react";
import Timer from "./Timer";
import ParagraphBox from "./PargraphBox1";
import Caret from "./Caret";
import { useGameDetailsContext } from "@/context/game-details-context";
import ChallengeResult from "./ChallengeResult";
import { useRouter } from "next/router";
import { LeaveChannelMessage } from "@/utils/type";
import { socket } from "@/utils/socket";

const Playground: React.FC = () => {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [stopGame, setStopGame] = useState<boolean>(false);
  const caretRef = useRef<HTMLDivElement | null>(null);
  const { state, dispatch } = useGameDetailsContext();
  const { channel, result } = state;
  const router = useRouter();

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

  return (
    <>
      <div className={result.isResultOut ? styles["hide"] : ""}>
        <Caret ref={caretRef} />
        {!startGame && <Countdown setStartGame={setStartGame} />}
        <div className={styles.playground}>
          <Timer startGame={startGame} setStopGame={setStopGame} />
          <ParagraphBox
            caretRef={caretRef}
            startGame={startGame}
            stopGame={stopGame}
          />
        </div>
      </div>
      {result.isResultOut && <ChallengeResult />}
    </>
  );
};

export default Playground;
