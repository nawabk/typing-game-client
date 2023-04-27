import styles from "../../styles/Playground.module.css";
import Countdown from "./CountDown";
import { useState } from "react";
import Timer from "./Timer";
import ParagraphBox from "./PargraphBox1";

const Playground: React.FC = () => {
  const [startGame, setStartGame] = useState<boolean>(false);
  const [stopGame, setStopGame] = useState<boolean>(false);

  return (
    <div>
      {/* {!startGame && <Countdown setStartGame={setStartGame} />} */}
      <div className={styles.playground}>
        {/* <Timer startGame={startGame} setStopGame={setStopGame} /> */}
        <ParagraphBox />
      </div>
    </div>
  );
};

export default Playground;
