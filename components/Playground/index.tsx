import styles from "../../styles/Playground.module.css";
import Countdown from "./Countdown";
import { useRef, useState } from "react";
import Timer from "./Timer";
import ParagraphBox from "./PargraphBox1";
import Caret from "./Caret";
import { useGameDetailsContext } from "@/context/game-details-context";
import ChallengeResult from "./ChallengeResult";
import useRouteChange from "./hooks/useRouteChange";
import useSocketEvents from "./hooks/useSocketEvents";

const Playground: React.FC = () => {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [stopGame, setStopGame] = useState<boolean>(false);
  const caretRef = useRef<HTMLDivElement | null>(null);
  const { state } = useGameDetailsContext();
  const { result, channel, paragraph } = state;
  useRouteChange();
  useSocketEvents({ setStartGame, setStopGame });

  if (!channel || !paragraph) {
    return (
      <button className={styles.button}>
        <p className="p-large">Home</p>
      </button>
    );
  } else {
    if (!result.isResultOut) {
      return (
        <div>
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
      );
    } else {
      return <ChallengeResult />;
    }
  }
};

export default Playground;
