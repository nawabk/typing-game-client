import { useGameDetailsContext } from "@/context/game-details-context";
import Word from "./Word";
import styles from "@/styles/Playground.module.css";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import WpmTracker from "./WpmTracker";

const ParagraphBox: React.FC<{
  caretRef: MutableRefObject<HTMLDivElement | null>;
  startGame: boolean;
  stopGame: boolean;
}> = ({ caretRef, startGame, stopGame }) => {
  const { state } = useGameDetailsContext();
  const { paragraph } = state;
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const lastCorrectlyTypedWordIndex = useRef<number>(-1);
  const paragraphRef = useRef<HTMLDivElement | null>(null);

  const words = paragraph.split(" ");

  useEffect(() => {
    WpmTracker.resetData();
  }, []);

  return (
    <>
      <div className={styles.words} ref={paragraphRef}>
        {words.map((word, index) => {
          return (
            <Word
              key={index}
              word={word}
              isActive={index === activeWordIndex}
              activeWordIndex={activeWordIndex}
              setActiveWordIndex={setActiveWordIndex}
              lastCorrectlyTypedWordIndex={lastCorrectlyTypedWordIndex}
              caretRef={caretRef}
              paragraphRef={paragraphRef}
              startGame={startGame}
              stopGame={stopGame}
            />
          );
        })}
      </div>
    </>
  );
};

export default ParagraphBox;
