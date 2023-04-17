import { useGameDetailsContext } from "@/context/game-details-context";
import ParagraphBox from "./ParagraphBox";
import styles from "../../styles/Playground.module.css";

const Playground: React.FC = () => {
  const { state } = useGameDetailsContext();
  const { userName, competitor, channel, paragraph } = state;

  return (
    <div className={styles.playground}>
      <ParagraphBox paragraph={paragraph} />
    </div>
  );
};

export default Playground;
