import { useGameDetailsContext } from "@/context/game-details-context";
import ParagraphBox from "./ParagraphBox";
import styles from "../../styles/Playground.module.css";
import Countdown from "./CountDown";
import { useState } from "react";

const Playground: React.FC = () => {
  const [startGame, setStartGame] = useState<boolean>(false);
  const { state } = useGameDetailsContext();
  const { userName, competitor, channel, paragraph } = state;

  return (
    <div className={styles.playground}>
      {!startGame && <Countdown setStartGame={setStartGame} />}
      <ParagraphBox paragraph={paragraph} startGame={startGame} />
    </div>
  );
};

export default Playground;
