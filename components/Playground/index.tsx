import styles from "../../styles/Playground.module.css";
import Countdown from "./Countdown";
import { useRef, useState } from "react";
import Timer from "./Timer";
import ParagraphBox from "./PargraphBox1";
import Caret from "./Caret";
import { useGameDetailsContext } from "@/context/game-details-context";
import ChallengeResult from "./ChallengeResult";

const Playground: React.FC = () => {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [stopGame, setStopGame] = useState<boolean>(false);
  const caretRef = useRef<HTMLDivElement | null>(null);
  const { state } = useGameDetailsContext();
  const { result } = state;

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
