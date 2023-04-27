import { useGameDetailsContext } from "@/context/game-details-context";
import Word from "./Word";
import styles from "@/styles/Playground.module.css";
import { useRef, useState } from "react";
import Caret from "./Caret";

const ParagraphBox: React.FC = () => {
  const { state } = useGameDetailsContext();
  const { paragraph } = state;
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const lastCorrectlyTypedWordIndex = useRef<number>(-1);
  const caretRef = useRef<HTMLDivElement | null>(null);
  const paragraphRef = useRef<HTMLDivElement | null>(null);

  const words = paragraph.split(" ");
  return (
    <>
      <Caret ref={caretRef} />
      <div className={styles.words} ref={paragraphRef}>
        {words.map((word, index) => {
          return (
            <Word
              key={index}
              word={word}
              isActive={index === activeWordIndex}
              setActiveWordIndex={setActiveWordIndex}
              lastCorrectlyTypedWordIndex={lastCorrectlyTypedWordIndex}
              caretRef={caretRef}
              paragraphRef={paragraphRef}
            />
          );
        })}
      </div>
    </>
  );
};

export default ParagraphBox;
