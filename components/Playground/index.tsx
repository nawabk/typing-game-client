import styles from "../../styles/Playground.module.css";
import Countdown from "./CountDown";
import { useRef, useState } from "react";
import Timer from "./Timer";
import ParagraphBox from "./PargraphBox1";
import { useGameDetailsContext } from "@/context/game-details-context";
import Caret from "./Caret";

const Playground: React.FC = () => {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [stopGame, setStopGame] = useState<boolean>(false);
  const caretRef = useRef<HTMLDivElement | null>(null);

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
};

export default Playground;
