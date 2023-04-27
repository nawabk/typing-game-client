import { useGameDetailsContext } from "@/context/game-details-context";
import Word from "./Word";
import styles from "@/styles/Playground.module.css";
import { useState } from "react";

const ParagraphBox: React.FC = () => {
  const { state } = useGameDetailsContext();
  const { paragraph } = state;
  const [activeWord, setActiveWord] = useState<number>(0);
  const words = paragraph.split(" ");
  return (
    <div className={styles.words}>
      {words.map((word, index) => (
        <Word
          key={index}
          word={word}
          isActive={index === activeWord}
          setActiveWord={setActiveWord}
        />
      ))}
    </div>
  );
};

export default ParagraphBox;
