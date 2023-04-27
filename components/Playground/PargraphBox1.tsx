import { useGameDetailsContext } from "@/context/game-details-context";
import Word from "./Word";
import styles from "@/styles/Playground.module.css";
import { useRef, useState } from "react";

const ParagraphBox: React.FC = () => {
  const { state } = useGameDetailsContext();
  const { paragraph } = state;
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const lastCorrectlyTypedWordIndex = useRef<number>(-1);

  const words = paragraph.split(" ");
  return (
    <div className={styles.words}>
      {words.map((word, index) => (
        <Word
          key={index}
          word={word}
          isActive={index === activeWordIndex}
          setActiveWordIndex={setActiveWordIndex}
          lastCorrectlyTypedWordIndex={lastCorrectlyTypedWordIndex}
        />
      ))}
    </div>
  );
};

export default ParagraphBox;
