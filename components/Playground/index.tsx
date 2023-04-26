import { useGameDetailsContext } from "@/context/game-details-context";
import ParagraphBox from "./ParagraphBox";
import styles from "../../styles/Playground.module.css";
import Countdown from "./CountDown";
import { useState } from "react";
import Timer from "./Timer";

const Playground: React.FC = () => {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [stopGame, setStopGame] = useState<boolean>(false);
  const { state } = useGameDetailsContext();
  const { userName, competitor, channel, paragraph } = state;

  return (
    <div>
      {!startGame && <Countdown setStartGame={setStartGame} />}
      <div className={styles.playground}>
        <Timer startGame={startGame} setStopGame={setStopGame} />
        <ParagraphBox
          paragraph={paragraph}
          startGame={startGame}
          stopGame={stopGame}
        />
      </div>
    </div>
  );
};

export default Playground;
